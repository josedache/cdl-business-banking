import { ButtonBase, Paper, Typography } from "@mui/material";
import { Icon as Iconify } from "@iconify/react/dist/iconify.js";
import useToggle from "hooks/use-toggle";
import SettingsUpdatePasswordDialog from "./SettingsUpdatePasswordDialog";
import SettingsUpdatePinDialog from "./SettingsUpdatePinDialog";

const SettingsSecurityTab = () => {
  const [
    openUpdatePasswordDialog,
    toggleUpdatePasswordDialog,
    setOpenUpdatePasswordDialog,
  ] = useToggle();

  const [openUpdatePinDialog, toggleUpdatePinDialog, setOpenUpdatePinDialog] =
    useToggle();

  const securityDetails = [
    {
      title: "Password",
      description: "Choose a strong password to make your account secure",
      canEdit: true,
      onClick: () => {
        setOpenUpdatePasswordDialog(true);
      },
      summaryTitle: "Password",
      summaryIcon: "material-symbols-light:lock",
    },
    {
      title: "Transaction Pin",
      description:
        "Make sure your Pin does not have repetitive numbers for stronger security",
      canEdit: true,
      onClick: () => {
        setOpenUpdatePinDialog(true);
      },
      summaryTitle: "PIN",
      summaryIcon: "hugeicons:pin-code",
    },
  ];
  return (
    <div className="grid xl:grid-cols-5 gap-6">
      <div className="xl:col-span-3">
        <Paper className=" divide-y divide-gray-100 mt-6" elevation={0}>
          {securityDetails?.map((opt, index) => {
            return (
              <div key={index} className="py-6 px-10 ">
                <Typography className="font-semibold text-neutral-900">
                  {opt.title}
                </Typography>

                <Typography className=" text-neutral-500 mt-2">
                  {opt.description}
                </Typography>

                <div className="flex justify-between items-center mt-6">
                  <Typography className="flex items-center font-medium text-neutral-800">
                    <ButtonBase className=" ">
                      <Iconify
                        icon={opt.summaryIcon}
                        fontSize={16}
                        className=" "
                      />
                    </ButtonBase>
                    <span className="ml-1">{opt.summaryTitle}</span>
                  </Typography>
                  <Typography
                    className={`font-semibold cursor-pointer ${opt.canEdit ? "text-primary-main " : " text-primary-main/25"}`}
                    onClick={opt.onClick}
                  >
                    Update
                  </Typography>
                </div>
              </div>
            );
          })}
        </Paper>
      </div>

      <Paper className="xl:col-span-2 py-6 px-10 mt-6 h-fit" elevation={0}>
        <Typography className="font-semibold text-neutral-900">
          Need help?
        </Typography>

        <Typography className=" text-neutral-500 mt-2">
          Let us know if anything isn't working as you expect
        </Typography>

        <Typography
          className="font-semibold text-primary-main mt-6"
          onClick={() => {}}
        >
          Contact Support
        </Typography>
      </Paper>
      {openUpdatePasswordDialog && (
        <SettingsUpdatePasswordDialog
          open={openUpdatePasswordDialog}
          onClose={toggleUpdatePasswordDialog}
        />
      )}

      {openUpdatePinDialog && (
        <SettingsUpdatePinDialog
          open={openUpdatePinDialog}
          onClose={toggleUpdatePinDialog}
        />
      )}
    </div>
  );
};

export default SettingsSecurityTab;
