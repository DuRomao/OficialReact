
import React, { Fragment, useContext } from "react";
import sad from "../../../assets/images/other-images/sad.png";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Media, Col } from "reactstrap";
import { BACK_TO_HOME_PAGE, MENSAGEM_ERROR_400 } from "../../../Constant";
import CustomizerContext from "../../../_helper/Customizer";
import { P, H2 } from "../../../AbstractElements";
import LogoutSistema from "../../../Auth/Logout";

const Error500 = () => {
    const { layoutURL } = useContext(CustomizerContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        LogoutSistema();
        navigate(`${process.env.PUBLIC_URL}/login`);
    };

    const isAuthenticated = localStorage.getItem("Authenticated") === "true";

    return (
        <Fragment>
            <div className="page-wrapper">
                <div className="error-wrapper">
                    <Container>
                        <Media body className="img-100" src={sad} alt="" />
                        <div className="error-heading">
                            <H2 attrH2={{ className: "headline font-primary" }}>
                                {"500"}
                            </H2>
                        </div>
                        <Col md="8 offset-md-2">
                            <P attrPara={{ className: "sub-content" }}>
                                {MENSAGEM_ERROR_400}
                            </P>
                        </Col>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            {isAuthenticated ? (
                                <Link
                                    to={`${process.env.PUBLIC_URL}/dashboard/default/${layoutURL}`}
                                >
                                    <Button color="primary" size="lg">
                                        {BACK_TO_HOME_PAGE}
                                    </Button>
                                </Link>
                            ) : (
                                <Link
                                    to={`${process.env.PUBLIC_URL}/login`}
                                >
                                    <Button color="primary" size="lg">
                                        {"Fazer Login"}
                                    </Button>
                                </Link>
                            )}
                            
                            {isAuthenticated && (
                                <Button 
                                    color="secondary" 
                                    size="lg" 
                                    onClick={handleLogout}
                                >
                                    {"Sair"}
                                </Button>
                            )}
                        </div>
                    </Container>
                </div>
            </div>
        </Fragment>
    );
};

export default Error500;
