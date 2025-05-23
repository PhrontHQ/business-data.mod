var criteria = new Criteria().initWithExpression("originId == $.originId && parent != null && respondentQuestionnaires.filter{questionnaire.name == $.questionnaireName && respondentAnswers.filter{questionnaireQuestion.question.isOpenEnded == false && answers.filter{booleanValue == true}.length > 0}.length > 0}", {
    originId: originId,
    questionnaireName: this.supplementalHealthQuestionnaireName
});



syntax = {
    "type":"and",
    "args":[
        {
            "type":"and",
            "args":[
                {
                    "type":"equals",
                    "args":[
                        {
                            "type":"property",
                            "args":[
                                {
                                    "type":"value"
                                },
                                {
                                    "type":"literal",
                                    "value":"originId"
                                }
                            ]
                        },
                        {
                            "type":"property",
                            "args":[
                                {
                                    "type":"parameters"
                                },
                                {
                                    "type":"literal",
                                    "value":"originId"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type":"not",
                    "args":[
                        {
                            "type":"equals",
                            "args":[
                                {
                                    "type":"property",
                                    "args":[
                                        {
                                            "type":"value"
                                        },
                                        {
                                            "type":"literal",
                                            "value":"parent"
                                        }
                                    ]
                                },
                                {
                                    "type":"literal",
                                    "value":null
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type":"filterBlock",
            "args":[
                {
                    "type":"property",
                    "args":[
                        {
                            "type":"value"
                        },
                        {
                            "type":"literal",
                            "value":"respondentQuestionnaires"
                        }
                    ]
                },
                {
                    "type":"and",
                    "args":[
                        {
                            "type":"equals",
                            "args":[
                                {
                                    "type":"property",
                                    "args":[
                                        {
                                            "type":"property",
                                            "args":[
                                                {
                                                    "type":"value"
                                                },
                                                {
                                                    "type":"literal",
                                                    "value":"questionnaire"
                                                }
                                            ]
                                        },
                                        {
                                            "type":"literal",
                                            "value":"name"
                                        }
                                    ]
                                },
                                {
                                    "type":"property",
                                    "args":[
                                        {
                                            "type":"parameters"
                                        },
                                        {
                                            "type":"literal",
                                            "value":"questionnaireName"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type":"gt",
                            "args":[
                                {
                                    "type":"property",
                                    "args":[
                                        {
                                            "type":"filterBlock",
                                            "args":[
                                                {
                                                    "type":"property",
                                                    "args":[
                                                        {
                                                            "type":"value"
                                                        },
                                                        {
                                                            "type":"literal",
                                                            "value":"respondentAnswers"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type":"and",
                                                    "args":[
                                                        {
                                                            "type":"equals",
                                                            "args":[
                                                                {
                                                                    "type":"property",
                                                                    "args":[
                                                                        {
                                                                            "type":"property",
                                                                            "args":[
                                                                                {
                                                                                    "type":"property",
                                                                                    "args":[
                                                                                        {
                                                                                            "type":"value"
                                                                                        },
                                                                                        {
                                                                                            "type":"literal",
                                                                                            "value":"questionnaireQuestion"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "type":"literal",
                                                                                    "value":"question"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "type":"literal",
                                                                            "value":"isOpenEnded"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "type":"literal",
                                                                    "value":false
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "type":"gt",
                                                            "args":[
                                                                {
                                                                    "type":"property",
                                                                    "args":[
                                                                        {
                                                                            "type":"filterBlock",
                                                                            "args":[
                                                                                {
                                                                                    "type":"property",
                                                                                    "args":[
                                                                                        {
                                                                                            "type":"value"
                                                                                        },
                                                                                        {
                                                                                            "type":"literal",
                                                                                            "value":"answers"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "type":"equals",
                                                                                    "args":[
                                                                                        {
                                                                                            "type":"property",
                                                                                            "args":[
                                                                                                {
                                                                                                    "type":"value"
                                                                                                },
                                                                                                {
                                                                                                    "type":"literal",
                                                                                                    "value":"booleanValue"
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        {
                                                                                            "type":"literal",
                                                                                            "value":true
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "type":"literal",
                                                                            "value":"length"
                                                                        }
                                                                    ]
                                                                },
                                                                {
                                                                    "type":"literal",
                                                                    "value":0
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type":"literal",
                                            "value":"length"
                                        }
                                    ]
                                },
                                {
                                    "type":"literal",
                                    "value":0
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}
