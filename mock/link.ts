import { MockMethod } from 'vite-plugin-mock'

const link = [
  {
    url: 'https://www.shnakun.com/voddetail/41777.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42246.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/39079.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42391.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42391.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/37320.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/37320.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42150.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42150.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41985.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41985.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41094.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41094.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42065.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42065.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42160.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42160.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/25684.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/25684.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42138.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42138.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41918.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41918.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42158.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42158.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42224.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42224.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41402.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41402.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42170.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42170.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42141.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42141.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41170.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41170.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40733.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40733.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42139.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42139.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/38041.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/38041.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41975.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41975.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41531.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41531.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42074.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42074.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41590.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41590.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40972.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40972.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40913.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40913.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40748.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40748.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/15335.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/15335.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/14699.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/14699.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42054.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42054.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41059.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41059.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42034.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42034.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42018.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/42018.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41990.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41990.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/39408.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/39408.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41403.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41403.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/39556.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/39556.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41135.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41135.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40725.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/40725.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41095.html/',
  },
  {
    url: 'https://www.shnakun.com/voddetail/41095.html/',
  },
]

const link1 = [
  'https://www.9biquge.info/44/44347/',
  'https://www.9biquge.info/25/25692/',
  'https://www.9biquge.info/44/44875/',
  'https://www.9biquge.info/41/41182/',
  'https://www.9biquge.info/14/14271/',
  'https://www.9biquge.info/41/41069/',
  'https://www.9biquge.info/44/44863/',
  'https://www.9biquge.info/41/41975/',
  'https://www.9biquge.info/37/37573/',
  'https://www.9biquge.info/42/42025/',
  'https://www.9biquge.info/44/44492/',
  'https://www.9biquge.info/44/44963/',
  'https://www.9biquge.info/44/44880/',
  'https://www.9biquge.info/18/18536/',
  'https://www.9biquge.info/41/41956/',
  'https://www.9biquge.info/43/43055/',
  'https://www.9biquge.info/15/15983/',
  'https://www.9biquge.info/43/43749/',
  'https://www.9biquge.info/34/34042/',
  'https://www.9biquge.info/44/44193/',
]

// 去重
const videoLink = link.reduce((acc:any, curr:any) => {
  const found = acc.find((item:any) => item.url === curr.url);
  if (!found) {
    acc.push(curr);
  }
  return acc;
}, []);
const novelLink = link1.map((url) => ({ url }))
export default [
  // 视频链接接口
  {
    url: '/mock-api/getVideoLink', //请求地址
    method: 'get', //请求方式
    response: () => {
      return { code: 200, data: videoLink }
    },
  },
  {
    url: '/mock-api/getNovelLink', //请求地址
    method: 'get', //请求方式
    response: () => {
      return { code: 200, data: novelLink }
    },
  },
] as MockMethod[]
