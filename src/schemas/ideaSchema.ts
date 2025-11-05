import { z } from 'zod'

export const ideaSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  content: z
    .string()
    .max(5000, '内容は5000文字以内で入力してください'),
  tags: z
    .array(z.string().min(1).max(50))
    .max(10, 'タグは10個まで登録できます')
    .default([])
})

export type IdeaInput = z.infer<typeof ideaSchema>
