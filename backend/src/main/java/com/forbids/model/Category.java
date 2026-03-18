package com.forbids.model;

public enum Category {
    ELECTRONICS("Electrónica"),
    FASHION("Moda"),
    HOME("Hogar"),
    SPORTS("Deportes"),
    BOOKS("Libros"),
    TOYS("Juguetes"),
    AUTOMOTIVE("Automóviles"),
    ART("Arte"),
    MUSIC("Música"),
    OTHER("Otros");

    private final String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
