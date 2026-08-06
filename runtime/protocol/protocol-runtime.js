/**
 * PACEMAKER Platform
 * Protocol Runtime
 *
 * Sprint 192
 * Version 1.2.0
 *
 * Responsibility
 * - Load Protocol
 * - Initialize Operation
 * - Flatten Stage tasks into Operation tasks
 * - Copy Protocol documents and outputs
 */

(function (global) {

    "use strict";


    function cloneList(list) {

        if (!Array.isArray(list)) {

            return [];

        }

        return list.map(function (item) {

            if (
                item &&
                typeof item === "object"
            ) {

                return Object.assign(
                    {},
                    item
                );

            }

            return item;

        });

    }


    function buildTasks(protocol) {

        var tasks = [];

        var stages =
            Array.isArray(protocol.stages)
                ? protocol.stages
                : [];


        stages.forEach(function (stage) {

            var stageTasks =
                Array.isArray(stage.tasks)
                    ? stage.tasks
                    : [];


            stageTasks.forEach(function (task) {

                tasks.push({

                    id:
                        task.id || null,

                    title:
                        task.title || "",

                    stage:
                        stage.id || null,

                    status:
                        task.status || "ready"

                });

            });

        });


        return tasks;

    }


    function execute(session, protocol) {

        session =
            session || {};

        protocol =
            protocol || {};


        session.protocol = {

            id:
                protocol.id || null,

            name:
                protocol.name || "",

            version:
                protocol.version || "1.0.0"

        };


        session.operation = {

    stage:
        protocol.firstStage || null,

    stageOrder:

        Array.isArray(protocol.stages)
            ? protocol.stages.map(function (stage) {

                return String(
                    stage.id
                );

            })
            : [],

    status:
        "ready",

    tasks:
        buildTasks(
            protocol
        ),

    documents:
        cloneList(
            protocol.documents
        ),

    outputs:
        cloneList(
            protocol.outputs
        )

};


        return session;

    }


    global.PacemakerProtocolRuntime = {

        execute:
            execute

    };


}(window));