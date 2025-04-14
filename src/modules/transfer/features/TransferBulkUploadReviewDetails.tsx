import {
  Button,
  ButtonBase,
  Checkbox,
  Chip,
  Collapse,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LoadingButton } from "@mui/lab";

import { TransferBulkContentProps } from "../types/TransferBulkStepForm";
import { Fragment, useState } from "react";

type TransferBulkUploadReviewDetailsProps = {} & TransferBulkContentProps;

export default function TransferBulkUploadReviewDetails(
  props: TransferBulkUploadReviewDetailsProps
) {
  const { formik, stepper } = props;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  // const successFullUploads = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     amount: 1000,
  //     status: "success",
  //   },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     amount: 2000,
  //     status: "success",
  //   },
  // ];

  const failedUploads = [
    {
      id: 1,
      name: "John Doe",
      amount: 1000,
      status: "failed",
    },
    {
      id: 2,
      name: "Jane Smith",
      amount: 2000,
      status: "failed",
    },
  ];
  return (
    <Paper elevation={0} className="mx-auto max-w-[768px]">
      <div className="p-6">
        <ButtonBase
          disableRipple
          className="flex items-center gap-2"
          onClick={() => stepper.previous()}
        >
          <Icon icon="weui:back-filled" fontSize={20} />
          <Typography>Go back</Typography>
        </ButtonBase>
      </div>

      <Divider />
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-4 p-6 h-[440px] overflow-y-auto scroll-hidden">
          <div>
            <div>
              <Typography variant="h5" className="font-semibold">
                Review details
              </Typography>
              <Typography className="text-neutral-500 max-w-[500px]">
                Ensure you confirm all your details before proceeding. All
                issues can be found in the Validation Report
              </Typography>

              <Button
                startIcon={<Icon icon="tabler:plus" />}
                variant="soft"
                className="mt-2"
              >
                Add another Recipient
              </Button>
            </div>
          </div>

          <div>
            <List
              sx={{ width: "100%", bgcolor: "background.paper" }}
              component="nav"
            >
              <ListItemButton
                onClick={handleClick}
                className="flex items-center gap-2"
              >
                {open ? (
                  <Icon icon="ic:baseline-expand-less" width="12" height="12" />
                ) : (
                  <Icon icon="ic:baseline-expand-more" width="12" height="12" />
                )}
                <Icon
                  icon="carbon:checkmark-outline"
                  width="20"
                  height="20"
                  className="text-[#12B76A]"
                />
                <Typography className="flex-1 font-semibold">
                  Fix [No.] accountsd
                </Typography>

                <div className="flex-1"></div>

                <Chip label="3 results Found" color="info" />
              </ListItemButton>
              <Divider />
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="Starred" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>

            <List
              sx={{ width: "100%", bgcolor: "background.paper" }}
              disablePadding
              component="nav"
            >
              <ListItemButton
                onClick={handleClick}
                className="flex items-center gap-2"
              >
                {open ? (
                  <Icon icon="ic:baseline-expand-less" width="12" height="12" />
                ) : (
                  <Icon icon="ic:baseline-expand-more" width="12" height="12" />
                )}

                <Icon
                  icon="hugeicons:alert-02"
                  width="20"
                  height="20"
                  className="text-[#F79009]"
                />
                <Typography className="flex-1 font-semibold">
                  132 Recepients matched
                </Typography>

                <div className="flex-1"></div>

                <Chip label="3 results Found" color="info" />
              </ListItemButton>
              <Divider />
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {failedUploads.map((item) => (
                    <Fragment>
                      <ListItem key={item.id}>
                        <ListItemButton
                          key={item.id}
                          sx={{ ml: 4 }}
                          className="flex items-center gap-2"
                        >
                          {open ? (
                            <Icon
                              icon="ic:baseline-expand-less"
                              width="12"
                              height="12"
                            />
                          ) : (
                            <Icon
                              icon="ic:baseline-expand-more"
                              width="12"
                              height="12"
                            />
                          )}
                          <ListItemText primary={item.name} />
                        </ListItemButton>
                        <Divider />
                      </ListItem>

                      <Collapse
                        in={open}
                        className="ml-20"
                        timeout="auto"
                        unmountOnExit
                      >
                        <List component="div" disablePadding>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemText primary="Starred" />
                          </ListItemButton>
                        </List>
                      </Collapse>
                    </Fragment>
                  ))}
                </List>
              </Collapse>
            </List>
          </div>
        </div>

        <Divider />

        <div className="px-4 py-4 gap-2 flex justify-between items-center">
          <FormControlLabel
            control={<Checkbox />}
            className="text-neutral-500 font-light"
            label="I confirm that the details have been cross-checked and is accurate  "
          />
          <LoadingButton
            variant="gradient"
            type="submit"
            size="large"
            disabled={!formik.isValid || !formik.dirty}
            loading={formik.isSubmitting}
            loadingPosition="end"
            endIcon={<></>}
          >
            Upload & Continue
          </LoadingButton>
        </div>
      </form>
    </Paper>
  );
}
