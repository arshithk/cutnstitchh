from PIL import Image
im = Image.open('public/images/cut-n-stitch-logo.png').convert('RGBA')
pixels = list(im.getdata())
new_pixels = []
for r, g, b, a in pixels:
    if (r, g, b) == (0, 0, 0):
        new_pixels.append((255, 255, 255, 0))
    else:
        new_pixels.append((r, g, b, a))
im.putdata(new_pixels)
im.save('public/images/cut-n-stitch-logo-transparent.png')
print('saved')
