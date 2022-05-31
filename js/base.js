export const baseURL = () => {
    let baseUrl = window.location.origin;
    if(baseUrl.includes("github") || baseUrl.includes("localhost")){
        let pathArray = window.location.pathname.split( '/' );
        baseUrl += `/${pathArray[1]}`;
    }
    return baseUrl;
}
