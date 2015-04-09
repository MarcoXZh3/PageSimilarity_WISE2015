'''
Created on Mar 13, 2015
@author: MarcoXZh
'''

import math, sqlite3

def RGBtoXYZ(rgb):
  if len(rgb) != 3:
    return None

  xyz = [0.0, 0.0, 0.0]
  for i in range(0, len(rgb)):
    xyz[i] = rgb[i] / 255.0
    xyz[i] = math.pow((xyz[i] + 0.055) / 1.055, 2.4) if xyz[i] > 0.04045 else xyz[i] / 12.92
  # for i in range(0, len(rgb))
  M = ((0.4124564, 0.3575761, 0.1804375), \
       (0.2126729, 0.7151522, 0.0721750), \
       (0.0193339, 0.1191920, 0.9503041))
  return [100.0 * (M[0][0] * xyz[0] + M[0][1] * xyz[1] + M[0][2] * xyz[2]), \
          100.0 * (M[1][0] * xyz[0] + M[1][1] * xyz[1] + M[1][2] * xyz[2]), \
          100.0 * (M[2][0] * xyz[0] + M[2][1] * xyz[1] + M[2][2] * xyz[2])]
# def RGBtoXYZ(*args)

'''
def XYZtoRGB(xyz):
  if len(xyz) != 3:
    return None

  M = (( 3.2404542, -1.5371385, -0.4985314), \
       (-0.9692660,  1.8760108,  0.0415560), \
       ( 0.0556434, -0.2040259,  1.0572252))
  rgb = [0.01 * (M[0][0] * xyz[0] + M[0][1] * xyz[1] + M[0][2] * xyz[2]), \
         0.01 * (M[1][0] * xyz[0] + M[1][1] * xyz[1] + M[1][2] * xyz[2]), \
         0.01 * (M[2][0] * xyz[0] + M[2][1] * xyz[1] + M[2][2] * xyz[2])]
  for i in range(0, len(rgb)):
    rgb[i] = 1.055 * math.pow(rgb[i], 1.0 / 2.4) - 0.055 if rgb[i] > 0.0031308 else 12.92 * rgb[i]
    rgb[i] = int(round(rgb[i] * 255.0))
  # for i in range(0, len(rgb))
  return rgb
# def XYZtoRGB(*args)
'''

def XYZtoLAB(xyz):
  if len(xyz) != 3:
    return None

  xyz_D65 = (95.047, 100.00, 108.883)
  lab = [0.0, 0.0, 0.0]
  for i in range(0, len(xyz)):
    lab[i] = xyz[i] / xyz_D65[i]
    lab[i] = math.pow(lab[i], 1.0 / 3.0) if lab[i] > 0.008856 else (903.3 * lab[i] + 16.0) / 116.0
  # for i in range(0, len(xyz))
  return [116.0 * lab[1] - 16.0, 500.0 * (lab[0] - lab[1]), 200.0 * (lab[1] - lab[2])]
# def XYZtoLAB(xyz)

'''
def LABtoXYZ(lab):
  if len(lab) != 3:
    return None

  xyz_D65 = (95.047, 100.00, 108.883)
  fy = (lab[0] + 16.0) / 116.0
  fx = lab[1] / 500.0 + fy
  fz = fy - lab[2] / 200.0

  x = math.pow(fx, 3.0)
  if x <= 0.008856:
    x = (116.0 * fx - 16.0) / 903.3
  y = math.pow(fy, 3.0) if lab[0] > 903.3 * 0.008856 else lab[0] / 903.3
  z = math.pow(fz, 3.0)
  if z <= 0.008856:
    z = (116.0 * fz - 16.0) / 903.3;
  return [x * xyz_D65[0], y * xyz_D65[1], z * xyz_D65[2]]
# def LABtoXYZ(lab)
'''

if __name__ == '__main__':
  conn = sqlite3.connect("databases/colorTest.db")
  c = conn.cursor()
  index = 0
  for r in range(0, 256):
    c.execute("CREATE TABLE colors%03d (idx int primary key, Green smallint, Blue smallint, L real, a real, b real);" \
               % r)
    for g in range(0, 256):
      records = []
      for b in range(0, 256):
        lab = XYZtoLAB(RGBtoXYZ([r, g, b]))
        records.append((index, g, b, lab[0], lab[1], lab[2]))
        index += 1
        print "%8d -- %03d %03d %03d" % (index, r, g, b)
        # if b % 32 == 0
      # for b in range(0, 256)
      c.executemany("INSERT INTO colors%03d VALUES (?, ?, ?, ?, ?, ?);" % r, records)
      conn.commit()
      print "=========================="
  # for - for - for
  c.close()
# if __name__ == '__main__'
