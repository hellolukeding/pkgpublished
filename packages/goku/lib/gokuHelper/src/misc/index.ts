/**
 * @description: 类名合并
 * @param {(string|undefined)[]} names 类名
 * @function 
 * @example classNames('a', 'b', 'c') => 'a b c'
 * @returns 
 */
export const classNames = (...names: (string | undefined)[]) => {
  return names.filter(name => {
    return typeof name === 'string' && name !== ''
  }).join(' ');
};


/**
 * @description: 生成以str开头的正则表达式
 * @param {string} str 
 * @function
 * @example generatorRegExp('abc') => /^abc/
 * @returns {RegExp} 
 */
export const generatorRegExp = (str: string) => {
  const escapedStr = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escapedStr}`);
}

/**
 * @description: 判断是否为PC端
 * @function
 * @example isPc() => true
 * @returns {boolean} 是否为PC端
 */
export const isPc = () => {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return false; // 移动端
  } else {
    return true; // PC端
  }
};

/**
 * @description: 下载文本文件
 * @param {string} filename 文件名
 * @param {string} text 文本
 * @function
 * @example download('test.txt', 'hello world')
 * @returns 
 */
export function download(filename: string, text: string) {
  let link = document.createElement("a");
  link.href = `data:text/plain;charset=utf-8,${text}`;
  link.download = filename;
  link.click();
  link.remove();
}


const _task = (task: () => void, cb?: (val: any) => void, val?: any) => {
  let starts = Date.now();
  requestAnimationFrame(() => {
    if (Date.now() - starts < 16.6) {
      task();
      cb && cb(val);
    } else {
      _task(task, cb, val);
    }
  })
}


/**
 * @description: 优化任务队列，防止屏幕卡顿
 * @description: 任务队列
 * @param {function} task 
 * @function
 * @example runTask(() => {console.log('hello world')})
 * @returns 
 */
export const runTask = async (task: () => void) => {
  return new Promise((resolve) => {
    _task(task, resolve)
  })

}


/**
 * @description 解析路由query传参，转换成json对象
 * @param {URLSearchParams} parmas query传参  
 * @function
 * @example urlParmasParse(new URLSearchParams('?a=1&b=2')) => {a: 1, b: 2}
 * @returns {JSON} {key: value, ...}
 */
export const urlParmasParse = (parmas: URLSearchParams) => {
  return Array.from(parmas.entries()).reduce((pre, cur) => {
    return {...pre, [cur[0]]: cur[1]};
  }, {} as any)
}

/**
 * @description 删除路由query传参中的某些key
 * @param {URLSearchParams} parmas query传参
 * @param {string[]} keys 要删除的key
 * @function
 * @example urlParmasDel(new URLSearchParams('?a=1&b=2'), 'a') => {b: 2}
 * @returns {JSON} {key: value, ...}
 */
export const urlParmasDel = (parmas: URLSearchParams, ...keys: string[]) => {
  const obj = urlParmasParse(parmas);
  keys.forEach(key => {
    obj?.[key] && delete obj[key];
  })
  return obj;
}


/**
 * @description 打印路由query传参
 * @param {URLSearchParams} parmas query传参
 * @function
 * @example logParams(new URLSearchParams('?a=1&b=2'))
 * @returns
 */
export const logParams = (params: URLSearchParams) => {
  const obj = urlParmasParse(params);
  const arr: [any, any][] = [];
  Object.keys(obj).forEach(key => {
    arr.push([key, obj[key]])
  })
  console.table(arr);
}

/**
 * @description 路由变化监听
 * @function
 * @example routeChangeListener((path) => {console.log(path)})
 * @param cb 路由变化监听回调
 * @returns
 */
export const routeChangeListener = (cb: (path: string) => void) => {
  window.addEventListener("popstate", () => {
    cb(window.location.pathname);
  })
};

/**
 * @description 获取路由query传参
 * @function
 * @example getUrlSearchParams() => URLSearchParams
 * @returns 路由query传参
 */
export const getUrlSearchParams = () => {
  return new URLSearchParams(window.location.search);
};


/*--------------------------------------- worker ------------------------------------------*/
/**
 * @description 创建worker
 * @param worker 代码块
 * @returns worker
 * @example createWorker(() => {console.log('hello world')})
 * @example 
 * //component
 * import worker from "./index.worker";
 *   useEffect(()=>{
    const code=worker.toString();
    const blob=new Blob([`(${code})()`],{type:"application/javascript"});
    const myworker=new Worker(URL.createObjectURL(blob));
    myworker.postMessage("hello");
    myworker.onmessage=(e)=>{
      console.log(e.data);
    }
    return ()=>{
      myworker.terminate();
    }
  },[])

  //index.worker.js
  export default ()=>{
    self.onmessage = function(e) {
        self.postMessage('You said: ' + e.data);
    };
};
 */
export const createWorker = (worker: ()=>any) => {
  const blob = new Blob([`(${worker.toString()})()`], {type: 'application/javascript'});
  return new Worker(URL.createObjectURL(blob));
};