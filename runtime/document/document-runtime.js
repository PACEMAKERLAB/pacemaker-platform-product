/**
 * PACEMAKER Platform
 * Document Runtime
 *
 * Sprint 190
 * Version 1.1.0
 *
 * Responsibility
 * - Generate document from output
 */

(function (global) {

    "use strict";


    function create(output, template) {

        output =
            output || {};

        template =
            template || {};


        return {

            id:
                "document-" +
                Date.now(),

            type:
                template.type || "document",

            title:
                template.title || "",

            protocol:
                output.protocol || null,

            stage:
                output.stage || null,

            task:
                output.task || {},

            evidence:
                output.evidence || {},

            status:
                "generated",

            createdAt:
                new Date().toISOString()

        };

    }


    function generate(operation, template) {

        operation =
            operation || {};

        template =
            template || {};

        if (
            !Array.isArray(operation.outputs)
        ) {

            return [];

        }

        var documents =

    operation.outputs.map(

        function (output) {

            return create(
                output,
                template
            );

        }

    );


operation.documents =

    documents;


return documents;

    }


    global.PacemakerDocumentRuntime = {

        create:
            create,

        generate:
            generate

    };

}(window));