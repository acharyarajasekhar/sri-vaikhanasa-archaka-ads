export const defaults = {
    emptyArray: [],
    coverPhotoBgColor: "#004a8f",
    // coverPhotoBgColor: "rgba(var(--ion-color-primary-rgb), 0.14)",
    avatarUrl: "assets/defaults/avatar.png",
    baseApiURL: "https://us-central1-srivaikhanasanetwork-dev.cloudfunctions.net/api",
    fireStorageBucketName: 'srivaikhanasanetwork-dev.appspot.com',
    appPages: [
        {
            id: 'home',
            title: 'Home',
            url: '/home',
            icon: 'home-outline'
        },
        {
            id: 'myads',
            title: 'My Ads',
            url: '/myads',
            icon: 'list-outline'
        },
        {
            id: 'profile',
            title: 'My Profile',
            url: '/profile',
            icon: 'person-outline'
        }
    ],
    appInvitation: {
        subject: "Invitation to join Sri Vaikhanasa Archaka Ads App...",
        message: "Dear Reader, I would like to invite you to join Sri Vaikhanasa Archaka Ads App. An App designed to help our Archaka's in finding their suitable Temple..."
    }
}