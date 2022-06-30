import assert from "node:assert";
import axios from "axios";
import * as cheerio from "cheerio";

import { Business } from "./business";

async function loadDocument(url: string, params: any) {
    const response = await axios.get(url, { params: params });
    const document = cheerio.load(response.data);

    return document;
}

async function getBusinesses(): Promise<Business[]> {
    const parentPage = await loadDocument("https://sw.anu.ac.kr/main/sw/jw/main/list.php", {
        "search_bzstat": "S" // 접수중 상태인 지원사업만 조회 
    });

    const businessList: Business[] = [];

    const nodeList = parentPage(".lc_title_M")
    for (const node of nodeList) {
        const onClickText = node.attribs['onclick'];

        // 예를 들어 "javascript:goView('397')"; 에서 397을 추출함
        const splited = onClickText.split("\'");

        const id = parseInt(splited[1]);
        assert(!isNaN(id));

        // 개별 페이지에서 가져오기
        const childPage = await loadDocument("https://sw.anu.ac.kr/main/sw/jw/main/view.php", {
            "bznum": id
        });

        const business = new Business(id, childPage);
        businessList.push(business);
    }

    return businessList;
}

interface Notice {

}

async function getNotices() {
    const parentPage = await loadDocument('https://sw.anu.ac.kr/module/bbs/list.php', { 'mid': '/community/notice' });

    const notices: Notice[] = [];
    const nodeList = parentPage('.bbs_B_td_tr');

    for (const node of nodeList) {
        const onClickText = node.attribs['onclick'];

        // 예를 들어 "goView(0, 719, 719);" 에서 719를 추출함
        const splited = onClickText.split(',');

        const id = parseInt(splited[1]);
        assert(!isNaN(id));

        console.log(id)

        const childPage = await loadDocument("http://sw.anu.ac.kr/module/bbs/view.php", { 'mid': '/community/notice', 'rdno': id })
    }
}

export { getBusinesses };