package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"sync"
	"testing"
)

type summaryTestCase struct {
	url         string
	title       string
	description string
	imageURL    string
}

func testSummaryCase(t *testing.T, c *summaryTestCase, wg *sync.WaitGroup) {
	defer wg.Done()
	handler := http.HandlerFunc(SummaryHandler)
	resRec := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/summary?url="+c.url, nil)
	if nil != err {
		t.Fatal(err)
	}

	handler.ServeHTTP(resRec, req)
	if resRec.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusOK, resRec.Code)
	}

	contentType := resRec.Header().Get("Content-Type")
	expectedContentType := "application/json; charset=utf-8"
	if contentType != expectedContentType {
		t.Errorf("incorrect Content-Type response header: expected %s; got %s", expectedContentType, contentType)
	}

	if nil == resRec.Body || 0 == resRec.Body.Len() {
		t.Errorf("handler returned empty response body")
	}

	actual := make(map[string]string)
	decoder := json.NewDecoder(resRec.Body)
	err = decoder.Decode(&actual)
	if nil != err {
		t.Errorf("error decoding returned JSON: %s", err.Error())
	}

	if actual["title"] != c.title {
		t.Errorf("incorrect title: expected `%s` but got `%s`\n", actual["title"], c.description)
	}
	if actual["description"] != c.description {
		t.Errorf("incorrect description: expected `%s` but got `%s`\n", actual["description"], c.description)
	}
	if actual["image"] != c.imageURL {
		t.Errorf("incorrect image: expected `%s` but got `%s`\n", actual["image"], c.imageURL)
	}
}

func TestSummary(t *testing.T) {
	cases := []summaryTestCase{
		summaryTestCase{
			url:         "http://ogp.me/",
			title:       "Open Graph protocol",
			description: "The Open Graph protocol enables any web page to become a rich object in a social graph.",
			imageURL:    "http://ogp.me/logo.png",
		},
		summaryTestCase{
			url:         "https://www.wired.com/2017/01/happens-algorithms-design-concert-hall-stunning-elbphilharmonie/",
			title:       "What Happens When Algorithms Design a Concert Hall? The Stunning Elbphilharmonie",
			description: "Herzog and De Meuron's new philharmonic in Hamburg, Germany is an impressive feat of technology.",
			imageURL:    "https://www.wired.com/wp-content/uploads/2017/01/Hamburg_HP-1200x630-e1484185826635.jpg",
		},
		summaryTestCase{
			url:         "https://www.wired.com/2016/12/facebook-gets-real-fighting-fake-news/",
			title:       "Facebook’s Cracking Down on Fake News Starting Today",
			description: "The social network’s updates to address fake news are live now. And while they won’t solve the problem overnight, they’re an important first step.",
			imageURL:    "https://www.wired.com/wp-content/uploads/2015/09/FEATURED-Facebook_News-02.jpg-1200x630.jpg",
		},
	}

	wg := sync.WaitGroup{}
	for _, c := range cases {
		wg.Add(1)
		go testSummaryCase(t, &c, &wg)
	}
	wg.Wait()
}

func TestNoURL(t *testing.T) {
	handler := http.HandlerFunc(SummaryHandler)
	resRec := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/summary", nil)
	if nil != err {
		t.Fatal(err)
	}

	handler.ServeHTTP(resRec, req)

	//status code should be bad request
	if resRec.Code != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusBadRequest, resRec.Code)
	}
}

func TestBadURL(t *testing.T) {
	handler := http.HandlerFunc(SummaryHandler)
	resRec := httptest.NewRecorder()
	req, err := http.NewRequest("GET", "/summary?url=http://www.example.com/invalidpath", nil)
	if nil != err {
		t.Fatal(err)
	}

	handler.ServeHTTP(resRec, req)

	//status code should be bad request
	if resRec.Code != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: expected `%d` but got `%d`\n", http.StatusBadRequest, resRec.Code)
	}
}
