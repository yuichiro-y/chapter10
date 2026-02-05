"use client"

import { useState, FormEvent, ChangeEvent, } from "react";

type FormValues = {
 name: string;
 email: string;
 body: string;
}

type FormErrors = {
  name: string;
  email: string;
  body: string;
}

export default function Contact() { 

  // フォームの入力値を保持
  const [values ,setValues] = useState<FormValues>({
    name: "",
    email: "",
    body: ""
  });

  // 入力欄のエラーメッセージを保持
  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    body: ""
  });

  // 送信中フラグ
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // バリデーション
  const validate = (v: FormValues) => {
    const e: FormErrors = { name: "" , email: "" , body: ""};

    const nameLen = v.name.trim().length;
    if (!nameLen) e.name = "お名前は必須です。";
    else if (nameLen > 30) e.name = "お名前は30文字以内で入力してください。" ;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = (s:string) => EMAIL_RE.test(s.trim());
    if (!v.email.trim()) e.email = "メールアドレスは必須です。";
    else if (!isValidEmail(values.email)) e.email = "メールアドレスの形式が不正です。";

    const bodyLen = v.body.trim().length;
    if (!bodyLen) e.body = "本文は必須です。";
    else if (bodyLen > 500) e.body = "本文は500文字以内で入力してください。";

    return e;
  }

  // 送信ボタン押下時の処理
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // エラー内容の初期化
    const newErrors = validate(values);
    setErrors(newErrors); // state更新（赤字表示される）

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    try {
      setIsSubmitting(true);

      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.body.trim()
      }

      const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error("送信に失敗しました。");
      }
      alert("送信しました。")
      handleClear();

      } catch (err){
        console.error(err);
        alert(err instanceof Error ? err.message : "エラーが発生しました。");
      } finally {
        setIsSubmitting(false);
      }
  } 


  // 入力中に state を更新する処理
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // 更新
    setValues((prev) => ({ ...prev, [name]: value }));
    // 入力されるとエラーを消す
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // クリアボタン
  const handleClear = () =>{
    setValues({name:"",email:"",body:""});
    setErrors({name:"",email:"",body:""});
  }


  return (
  <>
    <main className="max-w-[800px] mx-auto my-10 px-2 text-left">
      <h1 className="font-bold text-xl mb-9">お問い合わせフォーム</h1>
      <form noValidate onSubmit={handleSubmit}>

        {/* お名前 */}
        <div className="mb-6">
          <div className="items-center flex justify-between">
            <label className="w-[240px]" htmlFor="name">お名前</label>
            <div className="w-full">
              <input 
                id="name" 
                name="name" 
                type="text"
                disabled={isSubmitting}
                className={`p-3 w-full rounded-lg border border-gray-300 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                value={values.name}
                required
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby="name-error"
              />
              {errors.name && (
              <p id="name-error" className="text-sm text-red-500 flex ">
                {errors.name}
              </p>
              )}
            </div>
          </div>

        </div>

        {/* メールアドレス */}
        <div className="mb-6">
          <div className="items-center flex justify-between">
            <label className="w-[240px]" htmlFor="email">メールアドレス</label>
            <div className="w-full">
              <input 
                id="email"
                name="email"
                type="email"
                disabled={isSubmitting}
                className={`p-3 w-full rounded-lg border border-gray-300 ${errors.email ? "border-red-400" : "border-gray-300"}`}
                value={values.email}
                required
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* 本文 */}
        <div className="mb-6">
          <div className="items-center flex justify-between">
            <label className="w-[240px]" htmlFor="body">本文</label>
            <div className="w-full">
              <textarea 
                id="body"
                name="body"
                disabled={isSubmitting}
                className={`p-3 w-full h-48 rounded-lg border border-gray-300 ${errors.body ? "border-red-400" : "border-gray-300"}`}
                value={values.body}
                required
                onChange={handleChange}
                aria-invalid={!!errors.body}
                aria-describedby="body-error"
              />

              {errors.body && (
                <p id="body-error" className="text-sm text-red-500">
                  {errors.body}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex justify-center mt-10">
          <button 
            type="submit" disabled={isSubmitting}
            className="mr-3 py-2 px-3 font-bold rounded-lg bg-black text-gray-50 border border-black"
          >送信</button>
          <button 
            type="button" disabled={isSubmitting}
            className="py-2 px-3 font-bold rounded-lg bg-gray-300 text-black border "
            onClick={handleClear}
          >クリア</button>
        </div>
      </form>
    </main>
  </>
); 
}