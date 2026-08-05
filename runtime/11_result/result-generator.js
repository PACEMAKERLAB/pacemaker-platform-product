/**
 * PACEMAKER Platform
 * Result Generator
 *
 * Version 1.1.0
 *
 * Responsibility
 * - Convert Session Result into User Result
 */

(function (global) {

    "use strict";


    function generate(input) {


        var session =
            input.session || {};



        var latest =
            session.latestResult || {};



        var sourceResult =
            latest.result || {};



        return global.PacemakerResultModel.create({


            experience:

                input.experience || "result",



            title:

                sourceResult.title ||

                "Growth Result",



            summary:

                sourceResult.summary ||

                "오늘의 실행 과정을 정리했습니다.",



            nextStep:

                sourceResult.nextStep ||

                "다음 단계를 이어갑니다.",



            status:

                sourceResult.status ||

                "completed"


        });


    }



    global.PacemakerResultGenerator = {


        generate:

            generate


    };



}(window));