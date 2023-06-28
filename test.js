const test = async () => {
    const response = await fetch("https://online.shenkar.ac.il/login/index.php", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "content-type": "application/x-www-form-urlencoded",
    "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "MoodleSession=hpd44mbegpb6ibl52m8nqejiji",
    "Referer": "https://online.shenkar.ac.il/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": "username=+208748343&password=020498%23E",
  "method": "POST"
    });;
    const responseHeaders = response.headers;
    const responseCookies = responseHeaders.get("set-cookie");
    console.log(responseCookies);
    console.log(responseHeaders);

}
test();