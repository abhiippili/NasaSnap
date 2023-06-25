import "./App.css";
import { Button, Container, Row, Form, Card, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import axios from "axios";
// import ImageDownloadLink from "./ImageDownloadLink";

function App() {
  const [search, setSearch] = useState("");
  const [images, setImages] = useState(null);
  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.get(
      `https://images-api.nasa.gov/search?q=${search}&media_type=image`
    );
    console.log(data.collection.items);
    const imgData = data.collection.items.slice(0, 10);
    setImages(imgData);
  };

  const downloadImage = async (src, name) => {
    const response = await axios.get(src, {
      responseType: "blob",
      headers: {
        "Content-Type": "image/jpeg"
      }
    });
    const fileName = name + ".jpg";
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <header style={{ marginTop: "1rem" }}>
        <h2>NASA IMAGES</h2>
      </header>
      <Container>
        <Form onSubmit={handleSubmit} style={{ margin: "1rem" }}>
          <Row>
            <Col md={11} xs={10}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search for a NASA image you want to download"
                  value={search}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={1} xs={2}>
              <Button type="submit" variant="info" size="md">
                <b>Search</b>
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {images &&
            images.map((img) => {
              return (
                <Col md={6}>
                  <Card
                    style={{
                      width: "600px",
                      margin: "auto",
                      marginBottom: "1rem"
                    }}
                  >
                    <Card.Img
                      className="image-card"
                      variant="top"
                      src={img.links[0].href}
                    />
                    <Card.Body>
                      <Card.Title>{img.data[0].title}</Card.Title>
                      <Button
                        variant="primary"
                        onClick={() =>
                          downloadImage(img.links[0].href, img.data[0].title)
                        }
                      >
                        Download Image
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </Container>
    </div>
  );
}

export default App;
