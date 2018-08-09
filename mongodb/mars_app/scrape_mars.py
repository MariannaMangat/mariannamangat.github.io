import time
from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver


def init_browser():
    # @NOTE: Replace the path with your actual path to the chromedriver
    executable_path = {"executable_path": "chromedriver.exe"}
    return Browser("chrome", **executable_path, headless=True)


def scrape():
    browser = init_browser()
    
    ######## NASA Mars News
    url = "https://mars.nasa.gov/news/"
    browser.visit(url)

    html = browser.html
    news_soup = BeautifulSoup(html, "html.parser")

    news_title = news_soup.find('div', class_='content_title').text
    news_paragraph = news_soup.find('div', class_='article_teaser_body').text

   

    ######## JPL space images
    url = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url)

    browser.find_by_id('full_image').click()

    # Button clicks in browser
    time.sleep(2)
    browser.find_link_by_partial_text('more info').click()
    time.sleep(2)

    html = browser.html
    img_soup = BeautifulSoup(html, 'html.parser')

    # Constracting the url
    img = img_soup.find('figure', class_='lede')
    featured_img_url = 'https://www.jpl.nasa.gov' + img.find('a')['href']

    ########### Twitter Mars Weather
    url = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url)

    html = browser.html
    weather_soup = BeautifulSoup(html, 'html.parser')

    latest_tweet = weather_soup.find('p', class_='TweetTextSize').text

    ########## Mars Space Facts
    url = 'http://space-facts.com/mars/'
    df_list = pd.read_html(url)

    df = df_list[0]
    df.columns = ['Description', 'Value']
    df.set_index('Description', inplace=True)

    facts_table = df.to_html(classes='table table-striped')

    ######## Asteorology News
    url = 'http://www.planetary.org/blogs/guest-blogs/bill-dunford/20140203-the-faces-of-mars.html'
    browser.visit(url)

    html = browser.html
    hemi_soup = BeautifulSoup(html, 'html.parser')

    h5s = hemi_soup.find_all("h5")
    # Hemispheres titles
    img_titles = []
    for h5 in h5s:
        h5 = str(h5)
    # Slice the text to remove hmlt tags
        h5 = h5[4:-5]
        img_titles.append(h5)

    # Slice the list to get the titles
    hemi_titles = img_titles[1:5]

    # Searching for a common tag to scrape image urls
    hemi_links = hemi_soup.find_all('img', class_='img840')
    hemi_urls = []
    for i in range(0, len(hemi_links)):
        hemi_urls.append(hemi_links[i]['src'])
    
    # Hemispheres Image Urls
    hemisphere_img_urls = []
    for title, img_url in zip(hemi_titles, hemi_urls):
        hemisphere_img_urls.append({'title': title, 'img_url': img_url})


    mars = {'news_title': news_title,
            'news_paragraph': news_paragraph,
            'featured_img_url': featured_img_url,
            'latest_tweet': latest_tweet,
            'facts_table': facts_table,
            'hemisphere_img_urls': hemisphere_img_urls}
  
    return mars



        
    
