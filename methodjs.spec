# -*- mode: python ; coding: utf-8 -*-

from PyInstaller.utils.hooks import collect_data_files, collect_submodules
import os

block_cipher = None

# Caminho base do projeto
project_root = os.path.abspath(SPECPATH)
backend_path = os.path.join(project_root, 'backend')
dist_path = os.path.join(project_root, 'dist')

# Coletar todos os arquivos da pasta dist (frontend buildado)
datas = [
    (os.path.join(dist_path, '*'), 'dist'),
    (os.path.join(dist_path, 'assets'), 'dist/assets'),
]

# Coletar dados do pywebview se necessário
datas += collect_data_files('webview')

# Submódulos ocultos que podem ser necessários
hiddenimports = [
    'webview',
    'webview.platforms.winforms',
    'clr',
    'pythonnet',
]

# Coletar submódulos do webview
hiddenimports += collect_submodules('webview')

a = Analysis(
    [os.path.join(backend_path, 'main.py')],
    pathex=[backend_path],
    binaries=[],
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='Method24',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,  # Não mostra console (aplicação GUI)
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=None,  # Adicione o caminho do ícone aqui se tiver: icon='path/to/icon.ico'
)
