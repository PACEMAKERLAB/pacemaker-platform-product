/**
 * PACEMAKER Platform
 * Coordinator Runtime
 *
 * Sprint 193
 * Version 1.0.0
 *
 * Responsibility
 * - Orchestrate Runtime Flow
 */

(function (global) {

    "use strict";


    function execute(session) {

        session =
            session || {};


        /*
         * Operation
         */

        session =

            global
                .PacemakerOperationRuntime
                .execute(
                    session
                );


        /*
         * Document
         */

        global
            .PacemakerDocumentRuntime
            .generate(

                session.operation,

                {

                    type:
                        "operation-document",

                    title:
                        "Operation Document"

                }

            );


        /*
         * Report
         */

        var report =

            global
                .PacemakerReportRuntime
                .generate(
                    session
                );


        /*
         * Save
         */

        global
            .PacemakerExperienceSessionStorage
            .save(
                session
            );


        return {

            session:
                session,

            report:
                report

        };

    }


    global.PacemakerCoordinatorRuntime = {

        execute:
            execute

    };

}(window));