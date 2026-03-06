# ... BUILD STAGE Kısmın Güzel, Aynen Kalsın ...
# (Sadece build aşamasında 'yarn build'in çalıştığından emin ol)

# ========================================
# 🏃 RUNTIME STAGE - Standalone Optimized
# ========================================
FROM node:22-alpine AS runner

RUN apk add --no-cache curl tzdata libc6-compat
WORKDIR /app

ENV TZ=UTC
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# PORTU 3001 YAPALIM (Dokploy ile çakışmasın)
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Sadece Standalone için gereken dosyaları kopyalıyoruz (Çok daha hızlı ve hafif)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Portu 3001 olarak expose et
EXPOSE 3001

# Healthcheck'i de 3001'e çekiyoruz
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# KRİTİK DEĞİŞİKLİK: Doğrudan node ile server.js'i çalıştırıyoruz
CMD ["node", "server.js"]
