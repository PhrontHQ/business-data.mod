// if(global && typeof global.XMLHttpRequest === undefined) {
//     global.XMLHttpRequest = require('xhr2');
// }
var Montage = require("montage/core/core").Montage,
MontageSerializer = require("montage/core/serialization/serializer/montage-serializer").MontageSerializer,
Deserializer = require("montage/core/serialization/deserializer/montage-deserializer").MontageDeserializer,
DataOperation = require("montage/data/service/data-operation").DataOperation,
phrontService = require("data/main.datareel/main.mjson").montageObject.childServices[0],
DataOperation = require("montage/data/service/data-operation").DataOperation,
sizeof = require('object-sizeof');


exports.OperationCoordinator = Montage.specialize(/** @lends OperationCoordinator.prototype */ {

    /***************************************************************************
     * Constructor
     */

    constructor: {
        value: function OperationCoordinator() {
            this._serializer = new MontageSerializer().initWithRequire(require);
            this._deserializer = new Deserializer();

            return this;
        }
    },

    MAX_PAYLOAD_SIZE: {
        value: 63
    },
    /*

        var serializedHandledOperation = await operationCoordinator.handleEvent(event, context, cb, client);

    */
    handleEvent: {
        value: function(event, context, callback, gatewayClient) {
            
            var serializedOperation = event.body,
                objectRequires,
                module,
                isSync = true,
                resultOperatationPromise,
                self = this;
        
            this._deserializer.init(serializedOperation, require, objectRequires, module, isSync);
            deserializedOperation = this._deserializer.deserializeObject();
            //console.log("handleEvent(...)",deserializedOperation);

            if(deserializedOperation.type ===  DataOperation.Type.Read) {
                return phrontService.handleReadOperation(deserializedOperation)
                .then(function(readOperationCompleted) {
                    //We need to assess the size of the data returned.
                    //serialize
                    var operationDataKBSize = sizeof(readOperationCompleted) / 1024;
                    if(operationDataKBSize < self.MAX_PAYLOAD_SIZE) {
                        //console.log("readOperationCompleted size is "+operationDataKBSize);
                        return gatewayClient
                        .postToConnection({
                            ConnectionId: event.requestContext.connectionId,
                            Data: self._serializer.serializeObject(readOperationCompleted)
                        })
                        .promise();
                    }
                    else {
                        /*
                            Failing:
                            Large ReadOperation split in 1 sub operations: operationDataKBSize:230.927734375, integerSizeQuotient:1, sizeRemainder:102.927734375, operationData.length:0, integerLengthQuotient:170, lengthRemainder: 0


                        */
                        var integerSizeQuotient = Math.floor(operationDataKBSize / self.MAX_PAYLOAD_SIZE),
                            sizeRemainder = operationDataKBSize % self.MAX_PAYLOAD_SIZE,
                            sizeRemainderRatio = sizeRemainder/operationDataKBSize,
                            operationData = readOperationCompleted.data,
                            integerLengthQuotient = Math.floor(operationData.length / integerSizeQuotient),
                            lengthRemainder = operationData.length % integerSizeQuotient,
                            i=0, countI = integerSizeQuotient, iChunk, iReadUpdateOperation,
                            promises = [];

                            if(lengthRemainder === 0 && sizeRemainder > 0) {
                                lengthRemainder = Math.floor(operationData.length*sizeRemainderRatio);
                                integerLengthQuotient = operationData.length-lengthRemainder;
                            }

                            iReadUpdateOperation = new DataOperation();
                            iReadUpdateOperation.type = DataOperation.Type.ReadUpdate;
                            iReadUpdateOperation.dataDescriptor = readOperationCompleted.dataDescriptor;
                            iReadUpdateOperation.criteria = readOperationCompleted.dataDescriptor;
                            iReadUpdateOperation.referrerId = readOperationCompleted.referrerId;

                            for(;(i<countI);i++) {
                                if((readOperationCompleted.type === DataOperation.Type.ReadCompleted) && i === (countI-1) && (lengthRemainder === 0)) {
                                    iReadUpdateOperation.type = DataOperation.Type.ReadCompleted;
                                }
                                iReadUpdateOperation.data = operationData.splice(0,integerLengthQuotient);
                                promises.push(gatewayClient.postToConnection({
                                    ConnectionId: event.requestContext.connectionId,
                                    Data: self._serializer.serializeObject(iReadUpdateOperation)
                                }).promise());
                            }

                            //Sends the last if some left:
                            if(lengthRemainder || operationData.length) {
                                promises.push(gatewayClient.postToConnection({
                                    ConnectionId: event.requestContext.connectionId,
                                    Data: self._serializer.serializeObject(readOperationCompleted)
                                }).promise());
                            }
                            console.log("Large ReadOperation split in "+(countI+lengthRemainder)+ " sub operations: operationDataKBSize:"+operationDataKBSize+", integerSizeQuotient:"+integerSizeQuotient+", sizeRemainder:"+sizeRemainder+", operationData.length:"+operationData.length+", integerLengthQuotient:"+integerLengthQuotient+", lengthRemainder:",lengthRemainder );
                            return Promise.all(promises);

                    }
    
                },function(readOperationFailed) {
                    console.error("OperationCoordinator: resultOperatationPromise failed ",readOperationFailed);
                    return self._serializer.serializeObject(readOperationFailed);
                });
            }
            else if(deserializedOperation.type ===  DataOperation.Type.Update) {
                resultOperatationPromise = phrontService.handleUpdateOperation(deserializedOperation);
            }
            else if(deserializedOperation.type ===  DataOperation.Type.Create) {
                resultOperatationPromise = phrontService.handleCreateOperation(deserializedOperation);
            }
            else {
                console.error("OperationCoordinator: not programmed to handle type of operation ",deserializedOperation);
                resultOperatationPromise = Promise.reject(null);
            }

            return resultOperatationPromise.then(function(operationCompleted) {
                //serialize
                return self._serializer.serializeObject(operationCompleted);

            },function(operationFailed) {
                console.error("OperationCoordinator: resultOperatationPromise failed ",operationFailed);
                return self._serializer.serializeObject(operationFailed);
            });
        
        }
    }
});