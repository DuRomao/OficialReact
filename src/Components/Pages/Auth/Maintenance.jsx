import React, { Fragment } from "react";
import { Container } from "reactstrap";
import { H2, H4, LI, UL } from "../../../AbstractElements";
import {
    MAINTENANCE,
    BACK_TO_HOME_PAGE,
    MensagemTextoManutencao,
} from "../../../Constant";

const Manutencao = () => {
    return (
        <Fragment>
            <section className="maintenance-sec">
                <div className="page-wrapper">
                    <div className="error-wrapper maintenance-bg">
                        <Container>
                            <UL
                                attrUL={{
                                    className: "maintenance-icons flex-row",
                                }}
                            >
                                <LI>
                                    <i className="fa fa-cog"></i>
                                </LI>
                                <LI>
                                    <i className="fa fa-cog"></i>
                                </LI>
                                <LI>
                                    <i className="fa fa-cog"></i>
                                </LI>
                            </UL>
                            <div className="maintenance-heading">
                                <H2 attrH2={{ className: "headline" }}>
                                    {MAINTENANCE}
                                </H2>
                            </div>
                            <H4 attrH4={{ className: "sub-content" }}>
                                {MensagemTextoManutencao}
                            </H4>
                            <div>
                                <a
                                    className="btn btn-primary btn-lg text-light"
                                    href="/"
                                >
                                    {BACK_TO_HOME_PAGE}
                                </a>
                            </div>
                        </Container>
                    </div>
                </div>
            </section>
        </Fragment>
    );
};

export default Manutencao;
