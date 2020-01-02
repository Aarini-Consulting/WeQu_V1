import {groupTypeIsShort, groupTypeShortList} from '/imports/helper/groupTypeShort.js';

const presentationUrl = {
    "norming":{
        "nl":"https://docs.google.com/presentation/d/e/2PACX-1vQya0hlWJr5Afui3RUMVWikwNfdnjb8IYUGcv7-bTC-gpFen_A5v8NvybtiW7K9310soQDEHiZpIUmG/embed?start=false&loop=false&delayms=3000",
        "de":"https://docs.google.com/presentation/d/e/2PACX-1vS259cHFIMTfOpItHeQmH4AKjxZSMYuj1QCEqSlphvbpGGuz5Tl-WXj1miuGzk3XiV28jiILpugZvN4/embed?start=false&loop=false&delayms=3000",
        "fr":"https://docs.google.com/presentation/d/e/2PACX-1vQuGS5vnibACWFCNyO5Pz0zQ1He1JzYcYYGbMrlfN_w0_qhFBawFe-Xq4I4-4YPI8sz1vsk3HJxqh6L/embed?start=false&loop=false&delayms=3000",
        "en":"https://docs.google.com/presentation/d/e/2PACX-1vQvaePfh8PDDv55BCJMBvLSWzZ5xOgI6yIMHQJ5i8q6Z87TRR9HMcT93X_tC7Uq_lpQkhztngk-K-UG/embed?start=false&loop=false&delayms=3000",
        "es-AR":"https://docs.google.com/presentation/d/e/2PACX-1vQvaePfh8PDDv55BCJMBvLSWzZ5xOgI6yIMHQJ5i8q6Z87TRR9HMcT93X_tC7Uq_lpQkhztngk-K-UG/embed?start=false&loop=false&delayms=3000"
    },
    "long":{
        "nl":"https://docs.google.com/presentation/d/e/2PACX-1vQspkT7RaUB2ctimmizxRomjyeYuyCNs9iGdDNdq3puBsmq258tLbqe5qlxcYl256Mg7ToB-G1cix6R/embed?start=false&loop=false&delayms=3000",
        "de":"https://docs.google.com/presentation/d/e/2PACX-1vR3das6J8UVMR6Kf2XlDKupJXqAvTR7rK8NGnvGuzeyMjabsu1zGuNhMmmQu_Uv5HIPoc9hjBjSaNRP/embed?start=false&loop=false&delayms=3000",
        "fr":"https://docs.google.com/presentation/d/e/2PACX-1vRAOs2duKEHmQ49qg-wha7P6HjjVWfNoZy_ZUVi8Xq9ViUpHvo-rFc5CFDYwbNTLJ3y1F9j0GiJMZdp/embed?start=false&loop=false&delayms=3000",
        "en":"https://docs.google.com/presentation/d/e/2PACX-1vShJZoQRi1WagGk2WBLSZazkZm6do0NKmTeOfGznNf2pdJKKiPicqG2jAhNdtCTtezLGdVeqxzfiuoI/embed?start=false&loop=false&delayms=3000",
        "es-AR":"https://docs.google.com/presentation/d/e/2PACX-1vShJZoQRi1WagGk2WBLSZazkZm6do0NKmTeOfGznNf2pdJKKiPicqG2jAhNdtCTtezLGdVeqxzfiuoI/embed?start=false&loop=false&delayms=3000"
    }
};

presentationUrl[groupTypeShortList[0]] = {
    "nl":"https://docs.google.com/presentation/d/e/2PACX-1vRx9BnajREdaAg9t0ftJOM1YhtwrbcKs-vAGGge-HO4Hx7uSS1T4Qf9fAUKftFzN71fqne4eowr8QvV/embed?start=false&loop=false&delayms=3000",
    "de":"https://docs.google.com/presentation/d/e/2PACX-1vTX1NjseqjQ0YEwa3YK2WbVcZB0tAR99pTEfMYZn6HtNhgXxRhp9IpAyjnLIk5-NoO_vlmhaNic1UWq/embed?start=false&loop=false&delayms=3000",
    "fr":"https://docs.google.com/presentation/d/e/2PACX-1vR1AyItUfC3CT2LQB7RzyOerpmsalSUj2Ev7aTa9ahraLDlk1fuAb4Sa4OfCtH32J49b4zd0qdXTHOj/embed?start=false&loop=false&delayms=3000",
    "en":"https://docs.google.com/presentation/d/e/2PACX-1vRS3I0zHq194L-ovan3W_Cfe8eD29_yypYi5VVFWwj89yp3mpgpyDBrcBBUcMn1sorVKFFBH6X2TYWP/embed?start=false&loop=false&delayms=3000",
    "es-AR": "https://docs.google.com/presentation/d/e/2PACX-1vQlE3hyfYLoGnbyO33R9ouSAFOfQ-Hi6TIWEPg2fMnN7ktn-Hsn5_aOV568NeRKfbXaFVlRH4wAZRHe/embed?start=false&loop=false&delayms=3000"
};

presentationUrl[groupTypeShortList[1]] = {
    "nl":"https://docs.google.com/presentation/d/e/2PACX-1vQqb-3-uYBXKn3RYJy4L8QtoEIWxVQ7N9h1klSRYUxODaYASpBFhFeZczWBgCTc_ITvI7B-DiMyAfwn/embed?start=false&loop=false&delayms=3000",
    "de":"https://docs.google.com/presentation/d/e/2PACX-1vSOuhvOpmywyHN34TsGKhN-7J0r0Q6pXEF-23bnLoN3ik4TBRa4MzLnj0RYZS_7e6UqGJjlbu5F-RSp/embed?start=false&loop=false&delayms=3000",
    "fr":"https://docs.google.com/presentation/d/e/2PACX-1vSLqABcfyY_8iGNuLsMoT5zd5l0DYLcdK9EA0WWO4mSKe-f2qEDBqvP0Ri8pJh9wE-kFUH_BYQpi76n/embed?start=false&loop=false&delayms=3000",
    "en":"https://docs.google.com/presentation/d/e/2PACX-1vSa8BbPmjSvEK9xOb1ze2iwbH06Nl0SqM0cqGkP1JOiZOnrW4LPMO2-7T6CSAIPkTwHHT831OfVvKlH/embed?start=false&loop=false&delayms=3000",
    "es-AR": "https://docs.google.com/presentation/d/e/2PACX-1vSFBlPwT8-4bJKDoW4umXWz1GhT6_upCukuVyk-2O52r-TLx1_T532223yBm9DERSPh5KtqjMqGA9L6/embed?start=false&loop=false&delayms=3000"
};

presentationUrl[groupTypeShortList[2]] = {
    "nl":"https://docs.google.com/presentation/d/e/2PACX-1vRXW1IPp6vXkSHdE1g8-Jyy7846sNh9G966aNprXBnNhMsy8-EcgUtpnFks4kdRz_G9-DuxrywGY1Mm/embed?start=false&loop=false&delayms=3000",
    "de":"https://docs.google.com/presentation/d/e/2PACX-1vT_uyWBpKk9kLFee71IV9X1yfRjEDt68doH0xkWZSaypLmUz8NHyQo1HtK94sF-F7BYcyutyapEcrU3/embed?start=false&loop=false&delayms=3000",
    "fr":"https://docs.google.com/presentation/d/e/2PACX-1vQ_yEt9_0AM2moSNzbMyslyPI0wNmL01jpjDl8zOj--DUsQQxneflOrvBEbfYjDQxPgaSm_B36iHwC6/embed?start=false&loop=false&delayms=3000",
    "en":"https://docs.google.com/presentation/d/e/2PACX-1vQiMa68c0KyzcDzQ_Sx2Ow6ot6xJpICneGlUXP_vJpyUp81YrvBHvSI8XdArLzQJFTByWz7RkqXzfGW/embed?start=false&loop=false&delayms=3000",
    "es-AR": "https://docs.google.com/presentation/d/e/2PACX-1vSPhlHoHbXrI4wSkZkBjQWUu2ox4QCIY3-lmtjKfnYDgQUJ8Af1vDEYlkrTzLmG5Gf9LIW_8mQl7NhL/embed?start=false&loop=false&delayms=3000"
}

function getPresentationUrl(type, lang){
    return presentationUrl[type][lang];
};

export {getPresentationUrl}