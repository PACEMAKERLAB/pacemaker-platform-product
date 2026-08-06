/**
 * PACEMAKER Platform
 * Community Protocol
 *
 * Sprint 192
 * Version 1.0.0
 */

(function (global) {

    "use strict";

    global.PacemakerCommunityProtocol = {

        id:
            "community",

        version:
            "1.0.0",

        name:
            "울산 마을공동체",

        firstStage:
            "01",

        stages: [

            {

                id:
                    "01",

                title:
                    "사업 기본정보",

                tasks: [

                    {
                        id:
                            "task-01",

                        title:
                            "사업 기본정보"
                    },

                    {
                        id:
                            "task-02",

                        title:
                            "대표자 확인"
                    },

                    {
                        id:
                            "task-03",

                        title:
                            "사업유형 확인"
                    }

                ]

            },

            {

                id:
                    "02",

                title:
                    "공고 확인",

                tasks: [

                    {
                        id:
                            "task-04",

                        title:
                            "공고 확인"
                    }

                ]

            }

        ]

    };

}(window));