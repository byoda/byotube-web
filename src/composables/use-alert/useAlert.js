import { inject } from "vue";

export const useAlert = () => {
  const swal = inject("$swal");

  const showAlert = (args) => swal.fire({ ...args });

  const showError = (text, ...rest) =>
    showAlert({
      ...rest,
      icon: "error",
      title: "Error",
      toast: true,
      text: text,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: "colored-toast",
        title: "short-title-height",
        container: "short-container",
        htmlContainer: "swal-title",
        icon: "swal-icon",
      },
      timerProgressBar: true,
    });

  const showSuccess = (props) => {
    return showAlert({
      ...props,
      icon: "success",
      title: "Success",
      customClass: {
        confirmButton: "confirm-button",
      },
    });
  };

  const showErrorPopup = (props) => {
    return showAlert({
      ...props,
      icon: "error",
      title: "Error",
      customClass: {
        confirmButton: "confirm-button",
      },
    });
  };

  return {
    showAlert,
    showError,
    showSuccess,
    showErrorPopup
  };
};
