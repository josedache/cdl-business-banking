import { ButtonBase, Divider, Typography } from "@mui/material";
import clsx from "clsx";
import React from "react";
import SettingsGeneralTab from "../features/SettingsGeneralTab";
import SettingsBusinessInformationTab from "../features/SettingsBusinessInformationTab";
import SettingsSecurityTab from "../features/SettingsSecurityTab";

const Settings = () => {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };
  const tabs = [
    {
      title: "General",
      content: <SettingsGeneralTab />,
    },
    {
      title: "Business Information",
      content: <SettingsBusinessInformationTab />,
    },
    {
      title: "Security ",
      content: <SettingsSecurityTab />,
    },
  ];
  return (
    <div>
      <div className="pt-6">
        <Typography className="font-semibold" variant="h5">
          Settings
        </Typography>
        <div className="flex mt-4 gap-10">
          {tabs.map((tab, index) => (
            <ButtonBase
              className={clsx(
                index === selectedTab
                  ? "border-b-2 border-primary-main font-semibold text-primary-main"
                  : " text-neutral-600 ",
                "py-[10px] flex font-medium "
              )}
              onClick={() => handleTabChange(index)}
              key={index}
            >
              {tab.title}
            </ButtonBase>
          ))}
        </div>
        <Divider />

        {tabs[selectedTab].content}
      </div>
    </div>
  );
};

export default Settings;

export const Component = Settings;
