/*
 * Design: 登录/注册页面 (增强版)
 * 背景: 全屏轮播图 + 半透明登录/注册表单
 * 增加: 表单验证、记住密码、忘记密码提示
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const [, navigate] = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.username.trim()) errs.username = "请输入用户名";
    else if (formData.username.length < 2) errs.username = "用户名至少2个字符";
    if (!isLogin) {
      if (!formData.email.trim()) errs.email = "请输入邮箱";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "邮箱格式不正确";
    }
    if (!formData.password) errs.password = "请输入密码";
    else if (formData.password.length < 6) errs.password = "密码至少6个字符";
    if (!isLogin) {
      if (!formData.confirmPassword) errs.confirmPassword = "请确认密码";
      else if (formData.password !== formData.confirmPassword) errs.confirmPassword = "两次密码不一致";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (isLogin) {
      toast.success("登录成功！欢迎回来");
      setTimeout(() => navigate("/"), 800);
    } else {
      toast.success("注册成功！请登录");
      setIsLogin(true);
      setFormData({ ...formData, password: "", confirmPassword: "" });
    }
  };

  const InputField = ({ icon: Icon, label, type, field, placeholder }: { icon: React.ElementType; label: string; type: string; field: string; placeholder: string }) => (
    <div>
      <label className="block text-sm text-dong-indigo font-medium mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dong-light/60" />
        <input
          type={type === "password" && showPassword ? "text" : type}
          value={String((formData as unknown as Record<string, string | boolean>)[field] || "")}
          onChange={(e) => { setFormData({ ...formData, [field]: e.target.value }); setErrors({ ...errors, [field]: "" }); }}
          className={`w-full border-b-2 bg-transparent py-2.5 pl-9 pr-3 text-sm focus:outline-none transition-colors ${
            errors[field] ? "border-red-400 focus:border-red-500" : "border-dong-indigo/20 focus:border-dong-indigo/60"
          }`}
          placeholder={placeholder}
        />
        {type === "password" && (
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-dong-light/60 hover:text-dong-indigo">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/banner1-EELMC4QXVm9cuMSuKPUczR.webp)` }}
        >
          <div className="absolute inset-0 bg-dong-deep/40 backdrop-blur-[3px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-0 max-w-[820px] w-full mx-4 my-8 rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Panel */}
          <div className="md:w-[320px] bg-dong-indigo/85 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-white text-2xl font-serif font-bold mb-4">
              {isLogin ? "欢迎回来" : "加入我们"}
            </h2>
            <p className="text-white/60 text-sm mb-2 leading-relaxed">
              {isLogin ? "登录后即可体验完整的侗语学习功能" : "注册账号，开启侗族语言文化学习之旅"}
            </p>
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 my-5 shadow-lg">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-girl-portrait-5gRSDKjXUrXYxpMmfAKLGP.webp"
                alt="头像"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white/60 text-sm mb-3">
              {isLogin ? "还没有账号？" : "已有账号？"}
            </p>
            <Button
              variant="outline"
              onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
              className="border-white/40 text-white hover:bg-white/10 bg-transparent"
            >
              {isLogin ? "去注册" : "去登录"}
            </Button>
          </div>

          {/* Right Panel */}
          <div className="flex-1 bg-white/92 backdrop-blur-md p-8">
            <h3 className="text-center text-dong-indigo text-xl font-serif font-bold tracking-[0.15em] mb-7">
              {isLogin ? "LOGIN" : "REGISTER"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField icon={User} label="用户名" type="text" field="username" placeholder="请输入用户名" />
              {!isLogin && <InputField icon={Mail} label="邮箱" type="email" field="email" placeholder="请输入邮箱" />}
              <InputField icon={Lock} label="密码" type="password" field="password" placeholder="请输入密码" />
              {!isLogin && <InputField icon={Lock} label="确认密码" type="password" field="confirmPassword" placeholder="请再次输入密码" />}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.remember}
                      onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                      className="w-3.5 h-3.5 accent-dong-indigo"
                    />
                    <span className="text-dong-light">记住我</span>
                  </label>
                  <button type="button" onClick={() => toast.info("请联系管理员重置密码")} className="text-dong-rose hover:text-dong-indigo text-xs transition-colors">
                    忘记密码？
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full bg-dong-indigo hover:bg-dong-deep text-white py-3 mt-2">
                {isLogin ? "登录" : "注册"}
              </Button>
            </form>

            <p className="text-center text-xs text-dong-light mt-5">
              {isLogin ? "登录即表示您同意我们的服务条款" : "注册即表示您同意我们的服务条款和隐私政策"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
