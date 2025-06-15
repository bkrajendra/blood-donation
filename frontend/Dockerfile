FROM nginx:stable-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy Angular build output
# COPY --from=builder /app/dist/blood-donation-app/browser/* /usr/share/nginx/html/
COPY dist/blood-donation-app/browser/* /usr/share/nginx/html/
# Optional: custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
