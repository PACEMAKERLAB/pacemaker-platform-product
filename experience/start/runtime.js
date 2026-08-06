/**
 * PACEMAKER Platform
 * Start Experience
 * Runtime
 *
 * Sprint 192
 * Version 1.2.0
 *
 * Responsibility
 * - Execute the Start Experience flow.
 * - Start Experience Session.
 * - Load Protocol.
 * - Initialize Operation.
 */

(function (global) {

    "use strict";


    function execute(input) {

        input =
            input || {};


        /*
         * 1. Session 시작
         */

        var session =

            global
                .PacemakerExperienceSessionRuntime
                .start({

                    experience:
                        "start"

                });


        /*
         * 2. Protocol 불러오기
         */

        var protocol =

            input.protocol ||
            global
                .PacemakerProtocolLoader
                .load(

                    input.protocolId ||
                    "community"

                );


        if (!protocol) {

            throw new Error(
                "Start Experience: Protocol을 찾을 수 없습니다."
            );

        }


        /*
         * 3. Protocol 및 Operation 초기화
         */

        session =

            global
                .PacemakerProtocolRuntime
                .execute(

                    session,

                    protocol

                );


        /*
         * 4. Experience Gateway 실행
         */

        var gateway =

            global
                .PacemakerExperienceGatewayRuntime
                .execute({

                    experience:
                        "growth",

                    stage:
                        "start",

                    userInput:
                        input,

                    source:
                        "start-experience"

                });


        /*
         * 5. Start Experience 실행
         */

        var model =

            global
                .PacemakerStartModel
                .create(
                    input
                );


        var decision =

            global
                .PacemakerStartDecision
                .execute(
                    model
                );


        var result =

            global
                .PacemakerStartGenerator
                .generate(
                    decision,
                    model
                );


        var language =

            global
                .PacemakerStartLanguage
                .create(
                    result
                );


        global
            .PacemakerStartRenderer
            .render(
                language
            );


        /*
         * 6. 실행 결과 저장
         */

        session =

            global
                .PacemakerExperienceSessionRuntime
                .appendResult(

                    session,

                    {

                        experience:
                            "start",

                        result:
                            result

                    }

                );


        /*
         * 7. 다음 Experience 결정
         */

        var next =

            global
                .PacemakerNavigationRuntime
                .execute({

                    experience:
                        "understand"

                });


        return {

            status:
                "completed",

            session:
                session,

            protocol:
                protocol,

            gateway:
                gateway,

            result:
                result,

            nextStep:
                next

        };

    }


    global.PacemakerStartRuntime = {

        execute:
            execute

    };


}(window));