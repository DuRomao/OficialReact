import React, { Fragment } from "react";
import { TabContent, TabPane } from "reactstrap";
import { H5, P } from "../../../AbstractElements";
import { Configuration,TempoReal } from "../../../Config/Constant";
import CheckLayout from "./Tabs/CheckLayout";
import SidebarCusmizer from "./Tabs/Sidebar";

const TabCustomizer = ({ selected, callbackNavTab }) => {
    
    return (
        <Fragment>
            <TabContent activeTab={selected}>
                <div className="customizer-header">
                    <i
                        className="icon-close"
                        onClick={() => callbackNavTab("", false)}
                    ></i>
                    <H5>{Configuration}</H5>
                    <P attrPara={{ className: "mb-0" }}>
                        {TempoReal}{" "}
                        <i className="fa fa-thumbs-o-up txt-primary"></i>
                    </P>
                </div>
                <div className="customizer-body custom-scrollbar tab-content">
                    <TabPane tabId="check-layout">
                        <CheckLayout />
                    </TabPane>
                    <TabPane tabId="sidebar-type">
                        <SidebarCusmizer />
                    </TabPane>
                </div>
            </TabContent>
        </Fragment>
    );
};

export default TabCustomizer;
