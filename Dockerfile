FROM denoland/deno:2.7.5

WORKDIR /app

# Cache dependencies
COPY deno.json deno.lock* ./
RUN deno install

# Copy application source code
COPY . .

# Pre-cache entrypoint
RUN deno cache main.js

EXPOSE 8000

CMD ["deno", "run", "-A", "main.js"]