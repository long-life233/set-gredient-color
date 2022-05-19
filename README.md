# set-gredient-color

根据图片的颜色设置渐变背景色。超简单，源码有详细注释。

## 示例

<img src="./src/img/example.png">
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <div id="container1" style="padding: 20px;display: inline-block;">
        <img id="img1" style="width:200px;height:200px;object-fit: cover;"
            src="https://tse1.mm.bing.net/th/id/OET.8d716cc3e25d47d08b0e831004c53476?w=272&h=135&c=7&rs=1&o=5&dpr=1.25&pid=1.9"
            alt="">
    </div>
    <div  id="container2" style="padding: 20px;display: inline-block;">
        <img id="img2" style="width:200px;height:200px;object-fit: cover;"
            src="https://tse1.mm.bing.net/th/id/OET.7d7ee84cd2334b3ea765b533c1312228?w=272&h=135&c=7&rs=1&o=5&dpr=1.25&pid=1.9"
            alt="">

    </div>

</body>
<script src="./index.js"></script>
<script>
    let img1 = document.querySelector('#img1')
    let img2 = document.querySelector('#img2')

    setImgGredientColor(img1.src, "#container1")
    setImgGredientColor(img2.src, "#container2")

</script>

</html>
```
