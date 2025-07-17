import toast from "react-hot-toast";

const Toaster = () => {
    return (
        <div>
            position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 3000,
                style: {
                    fontSize: "16px",
                    padding: "16px",
                    borderRadius: "8px",
                },
                error: {
                    style: {
                        background: '#fef2f2',
                        color: '#991b1b',
                    },
                },
            }}
            containerStyle={{
                height: "150px",
                width: "100%",
            }}
        </div>
    );
}

export default Toaster;