#Ver o tamanho dos arquivos e pastas
du -sh /home/runner/workspace/* | sort -hr

# Apagar cache do node/webpack/eslint
rm -rf /home/runner/workspace/node_modules/.cache

# Apagar arquivos temporários do Replit
rm -rf /home/runner/workspace/.replit/tmp/*

# Apagar build do React (se existir)
rm -rf /home/runner/workspace/build

# Apagar logs (se existirem)
find /home/runner/workspace -name "*.log" -delete

#Ver depois do processo de limpeza
du -sh /home/runner/workspace/* | sort -hr

#Iniciar o projeto
npm run start-developer