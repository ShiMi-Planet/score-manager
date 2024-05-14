from aiohttp import web

async def handle(request):
    return web.FileResponse('./index.html')

async def static_handler(request):
    file_path = request.match_info['filename']
    return web.FileResponse(file_path)

app = web.Application()
app.router.add_get('/', handle)
app.router.add_static('/', path='./', name='static')
app.router.add_get('/{filename}', static_handler)

web.run_app(app, port=5001)