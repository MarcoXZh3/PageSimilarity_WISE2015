'''
Created on Mar 28, 2015

@author: MarcoXZh
'''
import requests, urllib2, httplib, sqlite3, os
from urlparse import urlparse
from lxml import html


def getTopSites(number):
  '''
  Retrieve the top web sites from Alexa (http://www.alexa.com/topsites)
  '''
  assert type(number) is int and 0 < number <= 500
  results = []
  urls = set()
  lenURLs = len(urls)
  index = 1
  page = 0
  while page < 20:
    links = []
    try:
      links = html.fromstring(requests.request("GET","http://www.alexa.com/topsites/global;%d"%page,timeout=5).text)\
                  .xpath("//p[@class=\"desc-paragraph\"]/a/text()")
    except:
      pass
    for link in links:
      if index <= number:
        url = ""
        try:
          url = urllib2.urlopen("http://" + link).geturl()
        except:
          continue
        if len(url) == 0:
          continue
        urls.add(url)
        if lenURLs != len(urls):
          lenURLs = len(urls)
          results.append((index, link.strip(), url, 0))
          index += 1
          print results[-1]
        # if len(url) != 0 and url not in urls
    # for - if
    page += 1
  # while page < 20
  conn = sqlite3.connect("databases/webpages.db")
  c = conn.cursor()
  c.execute("CREATE TABLE pages0_150327 (number int primary key, name text, url text, duplicate int);")
  c.executemany('INSERT INTO pages0_150327 VALUES (?, ?, ?, ?)', results)
  conn.commit()
# def getTopSites(number)

def crawlPage(url, pageExts):
  try:
    results = set()
    links = html.fromstring(requests.request("GET", url.strip(), timeout=5).text).xpath("//a")
    for link in links:
      href = link.attrib.get("href")
      if href is None:
        continue
      href = href.strip()
      if "#" in href:
        href = href[:href.index("#")]
      if href.startswith("/"):
        host = urlparse(url.strip())
        href = "%s://%s%s" % (host.scheme, host.netloc, href)
      ext = os.path.splitext(urlparse(href.strip()).path)[1]
      if ext not in pageExts:
        continue
      results.add(href)
    # for link in links
    return results
  except:
    return set()
# def crawlPage(url, pageExts)

if __name__ == "__main__":
  # Step 1: retrieve the top 500 top sites
  #getTopSites(500)

  # Step 2(Manually): remove improper sites and mark duplications

  """
  pageExts = [".html", ".htm", ".php", ".jsp", ".asp", ".aspx", ".c", ".srf", ""]
  conn = sqlite3.connect("databases/webpages.db")
  c = conn.cursor()
  # Stop 3: Crawl all direct links from the top 500 sites - Level 1
  '''
  c.execute("CREATE TABLE pages1_150328 (number int primary key, url text);")
  c.execute("SELECT * FROM pages0_150327;")
  urls = c.fetchall()
  lenURLs = len(urls)
  index = 1
  for url in urls:
    resultSet = set()
    try:
      resultSet = crawlPage(url[2], pageExts)
    except:
      continue
    rows = []
    for rs in resultSet:
      rows.append((index, rs))
      index += 1
    c.executemany('INSERT INTO pages1_150328 VALUES (?, ?)', rows)
    conn.commit()
    print "%5d/%d: %s" % (index, lenURLs, url[2])
  # for url in urls
  '''

  """
  # Step 4: Crawl all direct links from previous links - Level 2
  conn1 = sqlite3.connect("databases/webpages1.db")
  c1 = conn1.cursor()
  """
  #c1.execute("CREATE TABLE pages2_150330 (number int primary key, url text);")
  c.execute("SELECT * FROM pages1_150328;")
  urls = c.fetchall()
  lenURLs = len(urls)
  '''
  Exception 1: pages1_150328<number=15185>, pages2_150330<number=2,992,609> ~~ terminated;
  Exception 2: pages1_150328<number=44778>, pages2_150330<number=8,737,160> ~~ non-respond;
  Exception 3: pages1_150328<number=44779>, pages2_150330<number=8,737,160> ~~ non-respond;
  Exception 4: pages1_150328<number=55458>, pages2_150330<number=10,812,860> ~~ non-respond;
  Exception 5: pages1_150328<number=55459>, pages2_150330<number=10,812,860> ~~ non-respond;
  Exception 6: pages1_150328<number=57388>, pages2_150330<number=11,181,762> ~~ terminated;
  Exception 7: pages1_150328<number=57389>, pages2_150330<number=11,181,762> ~~ terminated;
  '''
  index = 1
  urlIndex = 1
  for url in urls:
    resultSet = crawlPage(url[1], pageExts)
    rows = []
    for rs in resultSet:
      rows.append((index, rs))
      index += 1
    if len(rows) != 0:
      c1.executemany('INSERT INTO pages2_150330 VALUES (?, ?)', rows)
      conn1.commit()
    print "%5d/%d: %s" % (urlIndex, lenURLs, url[1])
    urlIndex += 1
  # for url in urls
  """

  # Step 5: remove invalid URLs
  c1.execute("SELECT count(*) FROM pages2_150330;")
  numbers = c1.fetchone()[0]
  step = 4096
  end = numbers / step + 1 if numbers % step != 0 else numbers / step
  for i in range(0, end):
    print "%4d / %d" % (i, end)
    c1.execute("SELECT * FROM pages2_150330 WHERE number > %d AND number <= %d;" % (i * step, (i + 1) * step))
    urls = c1.fetchall()
    for url in urls:
      try:
        urllib2.urlopen(url[1])
      except Exception as e:
        c1.execute("DELETE FROM pages2_150330 WHERE number = %d;" % url[0])
        print "    %8d/%d: %s - %s -- %s" % (url[0], numbers, type(e).__name__, e.args, url[1])
    # for url in urls
    conn1.commit()
  # for i in range(0, end)
  print "Original records: %d" % numbers
  print "Current records : %d" % c1.execute("SELECT count(*) FROM pages2_150330;").fetchone()[0]



# if __name__ == "__main__"
