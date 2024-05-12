document.addEventListener('DOMContentLoaded', function() {
    const notificationButton = document.getElementById("notificationButton");
    notificationButton.addEventListener("click", () => {
        console.log("Notification button clicked");
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
            console.log("Notification permission granted.");
            }
        });
    });
});