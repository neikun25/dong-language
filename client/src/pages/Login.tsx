/*
 * Design: 登录/注册页面
 * 背景: 全屏轮播图 + 半透明登录/注册表单
 * 左侧: 欢迎信息 + 头像 + 登录切换
 * 右侧: 注册表单
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      if (!formData.username || !formData.password) {
        toast.error("请填写用户名和密码");
        return;
      }
      toast.success("登录成功！欢迎回来");
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error("请填写所有字段");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("两次密码输入不一致");
        return;
      }
      toast.success("注册成功！请登录");
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Background */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/banner1-EELMC4QXVm9cuMSuKPUczR.webp)`,
          }}
        >
          <div className="absolute inset-0 bg-dong-deep/30 backdrop-blur-[2px]" />
        </div>

        {/* Form Container */}
        <div className="relative z-10 flex flex-col md:flex-row gap-0 max-w-[800px] w-full mx-4 my-8 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Panel - Welcome */}
          <div className="md:w-[320px] bg-dong-indigo/80 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-white text-2xl font-serif font-bold mb-6">
              欢迎了解侗语
            </h2>
            <div className="w-24 h-24 rounded-full overflow-hidden border-3 border-white/30 mb-6 shadow-lg">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-girl-portrait-5gRSDKjXUrXYxpMmfAKLGP.webp"
                alt="用户头像"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white/70 text-sm mb-4">
              {isLogin ? "还没有账号？" : "已有账号"}
            </p>
            <Button
              variant="outline"
              onClick={() => setIsLogin(!isLogin)}
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
            >
              {isLogin ? "去注册" : "登录"}
            </Button>
          </div>

          {/* Right Panel - Form */}
          <div className="flex-1 bg-white/90 backdrop-blur-md p-8">
            <h3 className="text-center text-dong-indigo text-xl font-serif font-bold tracking-[0.2em] mb-8">
              {isLogin ? "LOGIN" : "REGISTER"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-dong-indigo font-medium mb-1.5">用户名</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full border-b-2 border-dong-indigo/20 bg-transparent py-2 px-1 text-sm focus:outline-none focus:border-dong-indigo/60 transition-colors"
                  placeholder="请输入用户名"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-dong-indigo font-medium mb-1.5">邮箱</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-b-2 border-dong-indigo/20 bg-transparent py-2 px-1 text-sm focus:outline-none focus:border-dong-indigo/60 transition-colors"
                    placeholder="请输入邮箱"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-dong-indigo font-medium mb-1.5">密码</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border-b-2 border-dong-indigo/20 bg-transparent py-2 px-1 text-sm focus:outline-none focus:border-dong-indigo/60 transition-colors"
                  placeholder="请输入密码"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm text-dong-indigo font-medium mb-1.5">确认密码</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full border-b-2 border-dong-indigo/20 bg-transparent py-2 px-1 text-sm focus:outline-none focus:border-dong-indigo/60 transition-colors"
                    placeholder="请再次输入密码"
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-dong-indigo hover:bg-dong-deep text-white py-3 mt-4"
              >
                {isLogin ? "登录" : "注册"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
