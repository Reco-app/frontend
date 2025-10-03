# Estágio 1: Dependências e Build
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
    else echo "Lockfile not found." && exit 1; \
    fi

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Estágio 2: Produção
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Cria um grupo e um usuário específicos para a aplicação
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# --- FIM DAS ADIÇÕES ---

COPY --from=builder /app/public ./public
# Agora o usuário 'nextjs' e o grupo 'nodejs' existem, e este comando funcionará
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Troca para o usuário não-root que acabamos de criar
USER nextjs

EXPOSE 3001

ENV PORT 3001

CMD ["node", "server.js"]