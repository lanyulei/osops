layui.use(['form','layer','jquery'],function(){
   var $ = layui.$,
   form = layui.form,
   layer = layui.layer;
   form.on('submit(add)',function(){
         layer.msg('最近页面写的好累啊！说好了只给个静态演示页的，完整的待后面再更新吧！',{icon: 5,time:5000,shade:0.1});

         return false;
   });
});