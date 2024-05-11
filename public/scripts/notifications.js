document.addEventListener('DOMContentLoaded', function() {
    const notificationButton = document.getElementById("notificationButton");
    notificationButton.addEventListener("click", () => {
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
            console.log("Notification permission granted.");
            }
        });
    });
});