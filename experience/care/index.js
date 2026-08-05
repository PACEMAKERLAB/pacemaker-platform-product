var session = null;


if(
    window.PacemakerExperienceSessionQuery
){

    session =
        PacemakerExperienceSessionQuery.latest();

}



PacemakerCareRuntime.execute({

    experience:
        "care",


    session:
        session

});