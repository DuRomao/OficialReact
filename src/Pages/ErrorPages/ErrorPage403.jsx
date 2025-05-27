import React, { Fragment, useContext } from "react";
import sad from "../../assets/images/other-images/sad.png";
import { Link } from "react-router-dom";
import { Container, Button, Media, Col } from "reactstrap";
import { BACK_TO_HOME_PAGE,MENSAGEM_ERROR_400 } from "../../Config/Constant";
import { H2, P } from "../../AbstractElements";
import CustomizerContext from "../../_helper/Customizer";

const Error403 = () => {
    const { layoutURL } = useContext(CustomizerContext);
    return (
        <Fragment>
            <div className="page-wrapper">
                <div className="error-wrapper">
                    <Container>
                        <Media body className="img-100" src={sad} alt="" />
                        <div className="error-heading">
                            <H2 attrH2={{ className: "headline font-success" }}>
                                {"403"}
                            </H2>
                        </div>
                        <Col md="8 offset-md-2">
                            <P attrPara={{ className: "sub-content" }}>
                                {MENSAGEM_ERROR_400}
                            </P>
                        </Col>
                        <Link
                            to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}
                        >
                            <Button color="success-gradien" size="lg">
                                {BACK_TO_HOME_PAGE}
                            </Button>
                        </Link>
                    </Container>
                </div>
            </div>
        </Fragment>
    );
};

export default Error403;
