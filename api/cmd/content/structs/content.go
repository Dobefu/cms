package structs

type Content struct {
	Id          int    `json:"id"`
	ContentType int    `json:"content_type"`
	Title       string `json:"title"`
	CreatedAt   string `json:"created_at"`
	UpdatedAt   string `json:"updated_at"`
}
