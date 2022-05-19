/**
 * 
 * @param {String} imgSrc 图片url
 * @param {String} targetSelector 元素选择器，例如'#app'
 */
function setImgGredientColor(imgSrc, targetSelector) {
    console.log(123);
    // 获取图片
    let img = new Image()
    img.src = imgSrc
    img.crossOrigin = "Anonymous"
    if(img.complete){
        console.log(11);
        callback()
    }else{
        img.onload = callback
    }

    function callback() {
        // 创建canvas
        let canvas = document.createElement('canvas');
        // 必须缩小10倍
        canvas.width = img.width * 0.1;
        canvas.height = img.height * 0.1;
        // 获取canvas2d对象
        let ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        // 返回的是一个Uint8ClampedArray类型数组，数组元素每4个分别代表r，g，b，a
        // 将其转为普通数组。
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        imgData = Array.from(imgData)
        // 将imgData转换为元素为拥有4个元素的数组（rgba）。分成多个不同的块
        // 每4个元素分别代表rgba值
        const perChunk = 4;
        // 
        let chunked = imgData.reduce((accumulator, item, index) => {
            const newIndex = Math.floor(index / perChunk)
            if (!accumulator[newIndex]) {
                accumulator[newIndex] = []
            }
            accumulator[newIndex].push(item)
            return accumulator
        }, [])

        // 我们需要r和g值在0~250之间，进行过滤一下
        let filtered = chunked.filter(rgba => {
            return rgba.slice(0, 2).every(val => val < 250) && rgba.slice(0, 2).every(val => val > 0)
        })

        // 再转换为一个对象，key为`{r}|{g}|{b}|{a}`字符串,value为key出现的频率
        let uniqObject = filtered.reduce((accumulator, item) => {
            let key = item.join('|')
            if (!accumulator[key]) {
                accumulator[key] = 1;
                return accumulator
            }
            accumulator[key] = ++accumulator[key]
            return accumulator
        }, {})

        // 接下来一系列操作是为了获取出现出现频率前十的rgba颜色
        let sorted = Object.keys(uniqObject).map(rgbaKey => {
            let components = rgbaKey.split('|')
            let brightness = (components[0] * 299 + components[1] * 587 + components[2] * 114) / 1000
            return {
                rgba: rgbaKey.split('|'),
                occurs: uniqObject[rgbaKey],
                brightness
            }
            // 先根据出现频率排序取前十，然后再根据亮度排序
        }).sort((a, b) => a.occurs - b.occurs).reverse().slice(0, 10).
            sort((a, b) => a.brightness - b.brightness).reverse()

        // 取第一个和最后一个极值 
        let topValues = [sorted[0], sorted[sorted.length - 1]]

        // 最后的步骤了，设置渐变值
        let rgbaGradientValues = topValues.map((item, index) => {
            // console.log(item,'aa');
            return `rgb(${item.rgba.slice(0, 3).join(',')}) ${index == 0 ? '0%' : '75%'}`
        }).join(',')
        let cssGradientProperty = `background-image: linear-gradient(135deg,${rgbaGradientValues})`

        // 接下来判断文字的颜色该设置为白色还是黑色
        let textProperty = ''
        function getMiddleRGB(start, end) {
            let w = 0.5 * 2 - 1;
            let w1 = (w + 1) / 2.0;
            let w2 = 1 - w1;
            let rgb = [parseInt(start[0] * w1 + end[0] * w2), parseInt(start[1] * w1 + end[1] * w2), parseInt(start[2] * w1 + end[2] * w2)];
            return rgb;
        }
        let rgb = getMiddleRGB(topValues[0].rgba.slice(0, 3), topValues[1].rgba.slice(0, 3))
        let o = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
        if (o > 125) {
            textProperty = 'color: #000';
        } else {
            textProperty = 'color: #fff';
        }
        // 最后,设置属性到元素上
        let target = document.querySelector(targetSelector)
        let style = `${target.getAttribute('style') || ''}; ${cssGradientProperty}; ${textProperty}`;
        target.setAttribute('style', style)
    }

}