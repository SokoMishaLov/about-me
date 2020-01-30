import React, { useEffect, useState } from 'react'
import "./activity.css"
import Fade from "react-reveal/Fade"
import _ from "lodash"
import { Card, Icon, Modal } from "antd"
import { getMyContributions } from "../../util/github/github";
import ProjectDescription from "./project-description";
import { USERNAME } from "../../util/consts/consts";

const Activity = () => {

    const [loading, setLoading] = useState(true)
    const [projects, setProjects] = useState([])

    useEffect(() => {
        setLoading(true)
        getMyContributions()
            .then(it => setProjects(_.get(it, "viewer.repositoriesContributedTo.nodes", [])))
            .finally(() => setLoading(false))
    }, [])

    const mainLang = (it) => _.get(it, "languages.nodes[0]", {})

    const openProjectModal = (project) => {
        Modal.info({
            maskClosable: true,
            width: 1000,
            icon: null,
            title: project["nameWithOwner"],
            content: <ProjectDescription project={ project }/>,
            okText: "Close"
        });
    }

    const renderProjects = (data) => (
        <div className="activity-projects">
            { _.orderBy(data, ["stargazers.totalCount", "watchers.totalCount", "forks.totalCount"], ["desc", "desc", "desc"])
                .map(it => (
                    <Card key={ it["id"] }
                          hoverable
                          className="project"
                          onClick={ () => openProjectModal(it) }>
                        <div className="project-name">{ _.toLower(it["nameWithOwner"]) }</div>
                        <div className="project-description">{ it["description"] }</div>
                        <div className="project-bottom">
                            <div className="project-bottom-badges">
                                <div className="watchers">
                                    <Icon type="eye"/>
                                    <span className="caption">{ _.get(it, "watchers.totalCount") }</span>
                                </div>

                                <div className="stars">
                                    <Icon type="star"/>
                                    <span className="caption">{ _.get(it, "stargazers.totalCount") }</span>
                                </div>

                                <div className="forks">
                                    <Icon type="fork"/>
                                    <span className="caption">{ _.get(it, "forks.totalCount") }</span>
                                </div>
                            </div>
                            <div className="language">
                                <div className="language-color"
                                     style={ {backgroundColor: _.get(mainLang(it), "color")} }/>
                                <div className="caption">{ _.get(mainLang(it), "name") }</div>
                            </div>
                        </div>
                    </Card>
                )) }
        </div>
    )


    return (
        !loading && (
            <Fade className="activity">
                <div>Open source projects I've contributed to</div>
                { renderProjects(_.filter(projects, it => _.toLower(_.get(it, "owner.login")) !== USERNAME)) }
                <div>My open source projects</div>
                { renderProjects(_.filter(projects, it => _.toLower(_.get(it, "owner.login")) === USERNAME && !_.get(it, "isFork", false))) }
            </Fade>
        )
    )
}

export default Activity