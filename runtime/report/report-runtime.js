/**
 * PACEMAKER Platform
 * Report Runtime
 *
 * Sprint 191
 * Version 1.0.0
 *
 * Responsibility
 * - Generate Report from Operation
 */

(function (global) {

    "use strict";


    function generate(session) {

        session =
            session || {};


        var operation =
            session.operation || {};


        return {

            id:

                "report-" +
                Date.now(),

            protocol:

                session.protocol || {},

            operation: {

                stage:
                    operation.stage,

                status:
                    operation.status

            },

            history:

                session.history || [],

            documents:

                operation.documents || [],

            outputs:

                operation.outputs || [],

            createdAt:

                new Date().toISOString()

        };

    }


    global.PacemakerReportRuntime = {

        generate:
            generate

    };

}(window));