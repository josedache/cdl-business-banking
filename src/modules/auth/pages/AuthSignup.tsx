import { useFormik } from "formik";
import { useSnackbar } from "notistack";

function AuthSignup() {
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        const data = {};
        enqueueSnackbar(data?.message || "Account Created Successfully!", {
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar(
          error?.message || error?.data?.message || "Failed to Create Account",
          {
            variant: "error",
          }
        );
      }
    },
  });

  return <>

  </>;
}

export default AuthSignup;

export const Component = AuthSignup;
