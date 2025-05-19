import { Avatar, Typography } from "@mui/material";

import { Director } from "../types/settings-director-profile";

type SettingsDirectorListProps = {
  directorsList: Director[];
  reInitializeFormikValues: (index: number) => void;
};
const SettingsDirectorList = (props: SettingsDirectorListProps) => {
  const { directorsList, reInitializeFormikValues } = props;
  return (
    <div className="px-6 h-full max-h-80">
      <div className="space-y-4">
        {directorsList?.map((opt, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className="flex justify-between items-center border border-neutral-200 rounded-xl p-4 "
            >
              <div className="flex gap-4 items-center">
                <Avatar
                  src={opt.avatar}
                  className={`w-12 h-12 text-base font-medium uppercase ${isEven ? "bg-[#FEEEDA] text-warning-700" : "bg-sky-100 text-[#1D74B5]"}`}
                >
                  {opt?.firstName?.[0]}
                  {opt?.lastName?.[0]}
                </Avatar>

                <div className=" ">
                  <Typography className="font-medium text-base capitalize">
                    {opt?.firstName} {opt?.lastName}
                  </Typography>
                  <Typography className="text-neutral-500">
                    {opt?.phone ?? ""}
                  </Typography>
                </div>
              </div>

              <Typography
                onClick={() => {
                  reInitializeFormikValues(index);
                }}
                className="text-primary-main font-semibold cursor-pointer"
              >
                Edit
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsDirectorList;
