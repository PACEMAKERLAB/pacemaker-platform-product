/**
 * PACEMAKER Platform
 * Alpha Engine
 *
 * Version 1.0.0
 *
 * 역할
 * - Platform Runtime 보조 Layer
 * - Context 준비
 * - Experience 실행 전 환경 생성
 */

(function (global) {

    "use strict";


    function execute(input) {


        if (!input) {

            throw new Error(
                "PACEMAKER Alpha Engine: input is required."
            );

        }


        return {

            engine:
                "alpha",

            version:
                "1.0.0",

            context: {

                experience:
                    input.experience || null,

                timestamp:
                    new Date().toISOString()

            },

            ready:
                true

        };

    }


    global.PacemakerAlphaEngine = {

        execute:
            execute

    };


}(this));